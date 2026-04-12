import { readdirSync } from "fs";
import { join } from "path";
import type { ScanResult } from "../types";
import { expandHome, formatBytes, getSize, isDirPresent } from "../utils/disk";

/** Minimum size to report a cache entry (10 MB) */
const MIN_REPORT_SIZE = 10 * 1024 * 1024;

/** System cache prefixes to skip (Apple-managed, regenerate quickly) */
const SKIP_PREFIXES = ["com.apple.", "CloudKit", "SiriTTS"];

export async function scanSystem(): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  // User Logs
  const logsPath = expandHome("~/Library/Logs");
  if (isDirPresent(logsPath)) {
    const size = getSize(logsPath);
    if (size > MIN_REPORT_SIZE) {
      results.push({
        id: "user-logs",
        title: "User Log Files",
        description: `Application and system log files (${formatBytes(size)}). Safe to clean — apps recreate logs as needed.`,
        category: "system",
        path: logsPath,
        size,
        risk: "safe",
        available: true,
        cleanCommand: "rm -rf ~/Library/Logs/*",
        cleanAction: { type: "rmrf" },
        icon: "gear",
      });
    }
  }

  // Top user cache consumers (skip Apple system caches)
  const cachesPath = expandHome("~/Library/Caches");
  if (isDirPresent(cachesPath)) {
    try {
      const entries = readdirSync(cachesPath);
      for (const entry of entries) {
        if (SKIP_PREFIXES.some((prefix) => entry.startsWith(prefix))) continue;

        const entryPath = join(cachesPath, entry);
        const size = getSize(entryPath);
        if (size < MIN_REPORT_SIZE) continue;

        results.push({
          id: `cache-${entry.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
          title: `${entry} Cache`,
          description: `Application cache (${formatBytes(size)}). Generally safe to clean when the app is not running.`,
          category: "system",
          path: entryPath,
          size,
          risk: "moderate",
          available: true,
          cleanCommand: `rm -rf ~/Library/Caches/"${entry}"`,
          cleanAction: { type: "rmrf" },
          icon: "gear",
        });
      }
    } catch {
      // Can't read caches dir
    }
  }

  // Sort system results by size
  results.sort((a, b) => b.size - a.size);
  return results;
}
