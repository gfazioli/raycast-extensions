import { execFileSync } from "child_process";
import { existsSync } from "fs";
import type { ScanResult } from "../types";

/**
 * Clean a scan result using the appropriate method:
 * - "rmrf": rm -rf the path
 * - "command": run the tool-specific command
 * Returns the size that was freed (estimated).
 */
export function cleanResult(result: ScanResult): number {
  const freed = result.size;

  try {
    if (result.cleanAction.type === "rmrf") {
      if (!existsSync(result.path)) return 0;
      execFileSync("rm", ["-rf", result.path], {
        timeout: 60000,
        stdio: ["pipe", "pipe", "pipe"],
      });
    } else {
      execFileSync(result.cleanAction.command, result.cleanAction.args, {
        timeout: 120000,
        stdio: ["pipe", "pipe", "pipe"],
      });
    }
    return freed;
  } catch {
    return 0;
  }
}

/**
 * Clean all safe results and return total freed bytes.
 */
export function cleanAllSafe(results: ScanResult[]): number {
  let totalFreed = 0;
  for (const result of results) {
    if (result.risk === "safe" && result.available && result.size > 0) {
      totalFreed += cleanResult(result);
    }
  }
  return totalFreed;
}
