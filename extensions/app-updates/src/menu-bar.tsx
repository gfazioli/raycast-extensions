import {
  Clipboard,
  Icon,
  LaunchType,
  MenuBarExtra,
  open,
  openCommandPreferences,
  launchCommand,
  showHUD,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { scanSparkleUpdates } from "./utils/sparkle-scanner";
import { scanCaskUpdates } from "./utils/cask-scanner";
import { scanMasUpdates } from "./utils/mas-scanner";
import { getStoredUpdates, storeUpdates } from "./utils/update-store";
import { getToolStatus } from "./utils/tool-status";
import type { AppUpdate, ToolStatus, UpdateSource } from "./utils/types";

const SOURCE_ICONS: Record<UpdateSource, Icon> = {
  sparkle: Icon.Globe,
  cask: Icon.Hammer,
  mas: Icon.AppWindowGrid2x2,
};

export default function Command() {
  const [updates, setUpdates] = useState<AppUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tools, setTools] = useState<ToolStatus>({ brew: true, mas: true });

  async function scan() {
    try {
      setTools(getToolStatus());

      const allUpdates: AppUpdate[] = [];

      const [caskUpdates, masUpdates] = await Promise.all([scanCaskUpdates(), scanMasUpdates()]);
      allUpdates.push(...caskUpdates, ...masUpdates);

      const sparkleUpdates = await scanSparkleUpdates();
      allUpdates.push(...sparkleUpdates);

      allUpdates.sort((a, b) => a.name.localeCompare(b.name));
      setUpdates(allUpdates);
      await storeUpdates(allUpdates);
    } catch (error) {
      console.error("[MenuBar] Scan failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getStoredUpdates().then((cached) => {
      if (cached.length > 0) {
        setUpdates(cached);
      }
      scan();
    });
  }, []);

  const count = updates.length;
  const title = isLoading && count === 0 ? "..." : count > 0 ? `${count}` : undefined;
  const tooltip = isLoading ? "Refreshing..." : count > 0 ? `${count} update(s) available` : "All apps are up to date";

  const missingTools = !tools.brew || !tools.mas;

  return (
    <MenuBarExtra icon={Icon.ArrowUp} title={title} tooltip={tooltip} isLoading={isLoading}>
      {count === 0 && !isLoading && <MenuBarExtra.Item title="All apps are up to date" icon={Icon.CheckCircle} />}

      {updates.map((app) => (
        <MenuBarExtra.Item
          key={`${app.source}-${app.name}`}
          icon={SOURCE_ICONS[app.source]}
          title={app.name}
          subtitle={`${app.currentVersion} → ${app.latestVersion}`}
          onAction={() => {
            if (app.downloadUrl) {
              open(app.downloadUrl);
            } else if (app.appPath) {
              open(app.appPath);
            }
          }}
        />
      ))}

      {missingTools && (
        <MenuBarExtra.Section title="Missing Tools">
          {!tools.brew && (
            <MenuBarExtra.Item
              title="Install Homebrew"
              icon={Icon.Download}
              tooltip="Homebrew is required for Cask update detection and Brew Maintenance"
              onAction={() => open("https://brew.sh")}
            />
          )}
          {!tools.mas && tools.brew && (
            <MenuBarExtra.Item
              title="Install mas (App Store CLI)"
              icon={Icon.Download}
              tooltip="Enables Mac App Store update detection. Click to copy install command."
              onAction={async () => {
                await Clipboard.copy("brew install mas");
                await showHUD("Copied: brew install mas");
              }}
            />
          )}
          {!tools.mas && !tools.brew && (
            <MenuBarExtra.Item
              title="mas requires Homebrew"
              icon={Icon.Info}
              tooltip="Install Homebrew first, then run: brew install mas"
            />
          )}
        </MenuBarExtra.Section>
      )}

      <MenuBarExtra.Separator />

      <MenuBarExtra.Item
        title="Refresh"
        icon={Icon.ArrowClockwise}
        shortcut={{ modifiers: ["cmd"], key: "r" }}
        onAction={() => {
          setIsLoading(true);
          scan();
        }}
      />
      <MenuBarExtra.Item
        title="Open Check Updates"
        icon={Icon.MagnifyingGlass}
        shortcut={{ modifiers: ["cmd"], key: "o" }}
        onAction={() => launchCommand({ name: "check-updates", type: LaunchType.UserInitiated })}
      />
      <MenuBarExtra.Item
        title="Preferences..."
        icon={Icon.Gear}
        shortcut={{ modifiers: ["cmd"], key: "," }}
        onAction={() => openCommandPreferences()}
      />
    </MenuBarExtra>
  );
}
