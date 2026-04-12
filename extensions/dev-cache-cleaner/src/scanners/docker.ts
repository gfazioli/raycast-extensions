import { execFileSync } from "child_process";
import type { ScanResult } from "../types";
import { isToolAvailable } from "../utils/disk";

export async function scanDocker(): Promise<ScanResult[]> {
  if (!isToolAvailable("docker")) return [];

  try {
    execFileSync("docker", ["info"], {
      timeout: 5000,
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch {
    return [];
  }

  const results: ScanResult[] = [];

  try {
    const output = execFileSync("docker", ["system", "df", "--format", "{{.Type}}\t{{.Size}}\t{{.Reclaimable}}"], {
      encoding: "utf-8",
      timeout: 10000,
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();

    for (const line of output.split("\n")) {
      const [type, , reclaimable] = line.split("\t");
      if (!type || !reclaimable) continue;

      const reclaimableBytes = parseDockerSize(reclaimable.replace(/\s*\(.*\)/, ""));
      if (reclaimableBytes <= 0) continue;

      const typeLower = type.toLowerCase().replace(/\s+/g, "-");
      const id = `docker-${typeLower}`;

      // Docker resources can only be cleaned via docker CLI, never rm -rf
      const pruneCommand = getPruneCommand(type);

      results.push({
        id,
        title: `Docker ${type} (reclaimable)`,
        description: `Reclaimable Docker ${type.toLowerCase()} space. Cleaned via docker CLI — review before pruning.`,
        category: "containers",
        path: "(managed by Docker)",
        size: reclaimableBytes,
        risk: "moderate",
        available: true,
        cleanCommand: pruneCommand.display,
        cleanAction: { type: "command", command: "docker", args: pruneCommand.args },
        requiresTool: "docker",
        icon: "hard-drive",
      });
    }
  } catch {
    // Docker command failed
  }

  return results;
}

function getPruneCommand(type: string): { display: string; args: string[] } {
  const t = type.toLowerCase();
  if (t.includes("image")) return { display: "docker image prune", args: ["image", "prune", "-f"] };
  if (t.includes("container")) return { display: "docker container prune", args: ["container", "prune", "-f"] };
  if (t.includes("volume")) return { display: "docker volume prune", args: ["volume", "prune", "-f"] };
  if (t.includes("build")) return { display: "docker builder prune", args: ["builder", "prune", "-f"] };
  return { display: "docker system prune", args: ["system", "prune", "-f"] };
}

function parseDockerSize(sizeStr: string): number {
  const match = sizeStr.match(/^([\d.]+)\s*(B|kB|MB|GB|TB)/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2];
  // Docker uses SI (decimal) units
  const multipliers: Record<string, number> = {
    B: 1,
    kB: 1000,
    KB: 1000,
    MB: 1000 ** 2,
    mb: 1000 ** 2,
    GB: 1000 ** 3,
    gb: 1000 ** 3,
    TB: 1000 ** 4,
  };
  return Math.round(value * (multipliers[unit] ?? 1));
}
