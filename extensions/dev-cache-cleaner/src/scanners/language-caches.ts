import type { ScanResult } from "../types";
import { expandHome, formatBytes, getSize, isDirPresent, isToolAvailable } from "../utils/disk";

export async function scanLanguageCaches(): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  // Gradle caches
  const gradlePath = expandHome("~/.gradle/caches");
  if (isDirPresent(gradlePath)) {
    const size = getSize(gradlePath);
    results.push({
      id: "gradle-cache",
      title: "Gradle Cache",
      description: `Cached dependencies and build data (${formatBytes(size)}). Safe to clean — Gradle re-downloads on next build.`,
      category: "language-caches",
      path: gradlePath,
      size,
      risk: "safe",
      available: true,
      cleanCommand: "rm -rf ~/.gradle/caches",
      cleanAction: { type: "rmrf" },
      icon: "code",
    });
  }

  // Maven repository
  const mavenPath = expandHome("~/.m2/repository");
  if (isDirPresent(mavenPath)) {
    const size = getSize(mavenPath);
    results.push({
      id: "maven-cache",
      title: "Maven Local Repository",
      description: `Cached Java dependencies (${formatBytes(size)}). Safe to clean — Maven re-downloads on next build.`,
      category: "language-caches",
      path: mavenPath,
      size,
      risk: "safe",
      available: true,
      cleanCommand: "rm -rf ~/.m2/repository",
      cleanAction: { type: "rmrf" },
      icon: "code",
    });
  }

  // Cargo registry (Rust)
  const cargoPath = expandHome("~/.cargo/registry");
  if (isDirPresent(cargoPath)) {
    const size = getSize(cargoPath);
    results.push({
      id: "cargo-registry",
      title: "Cargo Registry",
      description: `Cached Rust crate sources and indices (${formatBytes(size)}). Safe to clean — crates re-download on next build.`,
      category: "language-caches",
      path: cargoPath,
      size,
      risk: "safe",
      available: true,
      cleanCommand: "rm -rf ~/.cargo/registry",
      cleanAction: { type: "rmrf" },
      icon: "code",
    });
  }

  // Go modules — use go clean which handles read-only files
  const goModPath = expandHome("~/go/pkg/mod");
  if (isDirPresent(goModPath)) {
    const size = getSize(goModPath);
    results.push({
      id: "go-modules",
      title: "Go Module Cache",
      description: `Cached Go modules (${formatBytes(size)}). Safe to clean — modules re-download on next build.`,
      category: "language-caches",
      path: goModPath,
      size,
      risk: "safe",
      available: isToolAvailable("go"),
      cleanCommand: "go clean -modcache",
      cleanAction: { type: "command", command: "go", args: ["clean", "-modcache"] },
      requiresTool: "go",
      icon: "code",
    });
  }

  // Ruby gem cache
  const rubyGemPath = expandHome("~/.gem");
  if (isDirPresent(rubyGemPath)) {
    const size = getSize(rubyGemPath);
    results.push({
      id: "ruby-gem-cache",
      title: "Ruby Gem Cache",
      description: `Cached gem files (${formatBytes(size)}). Safe to clean — gems re-download on next install.`,
      category: "language-caches",
      path: rubyGemPath,
      size,
      risk: "safe",
      available: true,
      cleanCommand: "rm -rf ~/.gem",
      cleanAction: { type: "rmrf" },
      icon: "code",
    });
  }

  return results;
}
