import type { ScanResult } from "../types";
import { scanPackageCaches } from "./package-caches";
import { scanXcode } from "./xcode";
import { scanLanguageCaches } from "./language-caches";
import { scanDocker } from "./docker";
import { scanProjectArtifacts } from "./project-artifacts";
import { scanSystem } from "./system";

export async function scanAll(onProgress?: (step: string) => void): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  onProgress?.("Scanning package manager caches...");
  results.push(...(await scanPackageCaches()));

  onProgress?.("Scanning build artifacts and dependencies...");
  results.push(...(await scanProjectArtifacts()));

  onProgress?.("Scanning Xcode caches...");
  results.push(...(await scanXcode()));

  onProgress?.("Scanning Docker...");
  results.push(...(await scanDocker()));

  onProgress?.("Scanning language caches...");
  results.push(...(await scanLanguageCaches()));

  onProgress?.("Scanning system caches...");
  results.push(...(await scanSystem()));

  return results;
}
