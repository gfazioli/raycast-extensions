import { Action, ActionPanel, Color, Grid, Icon, List, showToast, Toast, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import type { FileEntry } from "./read-directory";
import { readFolders } from "./read-directory";
import { addRecentFolder, getPinnedFolders, togglePin } from "./storage";

type FileListProps = {
  items: FileEntry[];
  layout: string;
  showPins?: boolean;
  navigable?: boolean;
};

function formatSize(bytes: number): string {
  if (bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function FileActions({
  entry,
  navigable,
  showPins,
  onPinToggle,
}: {
  entry: FileEntry;
  navigable?: boolean;
  showPins?: boolean;
  onPinToggle?: () => void;
}) {
  const { push } = useNavigation();

  return (
    <ActionPanel>
      <Action.Open
        title={`Open ${entry.name}`}
        target={entry.fullPath}
        onOpen={async () => {
          if (entry.isDirectory) {
            try {
              await addRecentFolder(entry.fullPath);
            } catch {
              /* ignore storage errors */
            }
          }
        }}
      />
      {navigable && entry.isDirectory && (
        <Action
          title="Browse Subfolder"
          icon={Icon.ArrowRight}
          shortcut={{ modifiers: ["cmd"], key: "arrowRight" }}
          onAction={() => {
            const { entries: children } = readFolders(entry.fullPath);
            push(
              <List navigationTitle={entry.name}>
                {children.map((child) => (
                  <List.Item
                    key={child.fullPath}
                    icon={{ fileIcon: child.fullPath }}
                    title={child.name}
                    actions={<FileActions entry={child} navigable={navigable} />}
                  />
                ))}
              </List>,
            );
          }}
        />
      )}
      <Action.ShowInFinder title="Show in Finder" path={entry.fullPath} />
      {entry.isFile && <Action.ToggleQuickLook title="Quick Look" shortcut={{ modifiers: ["cmd"], key: "y" }} />}
      {entry.isFile && (
        <Action.Trash title="Move to Trash" paths={[entry.fullPath]} shortcut={{ modifiers: ["ctrl"], key: "x" }} />
      )}
      {showPins && entry.isDirectory && (
        <Action
          title="Toggle Pin"
          icon={Icon.Pin}
          shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}
          onAction={async () => {
            const pinned = await togglePin(entry.fullPath);
            await showToast({
              style: Toast.Style.Success,
              title: pinned ? `Pinned ${entry.name}` : `Unpinned ${entry.name}`,
            });
            onPinToggle?.();
          }}
        />
      )}
      <Action.CopyToClipboard title="Copy Path" content={entry.fullPath} shortcut={{ modifiers: ["cmd"], key: "c" }} />
    </ActionPanel>
  );
}

export function FileList({ items, layout, showPins, navigable }: FileListProps) {
  const [pinnedPaths, setPinnedPaths] = useState<string[]>([]);

  useEffect(() => {
    if (showPins) {
      getPinnedFolders().then(setPinnedPaths);
    }
  }, [showPins]);

  function reloadPins() {
    getPinnedFolders().then(setPinnedPaths);
  }

  const pinnedSet = new Set(pinnedPaths);
  const pinned = showPins ? items.filter((e) => pinnedSet.has(e.fullPath)) : [];
  const unpinned = showPins ? items.filter((e) => !pinnedSet.has(e.fullPath)) : items;

  if (layout === "List") {
    return (
      <List>
        {pinned.length > 0 && (
          <List.Section title="Pinned">
            {pinned.map((entry) => (
              <List.Item
                key={entry.fullPath}
                icon={{ fileIcon: entry.fullPath }}
                title={entry.name}
                accessories={[{ icon: { source: Icon.Pin, tintColor: Color.Orange } }]}
                quickLook={{ path: entry.fullPath }}
                actions={
                  <FileActions entry={entry} navigable={navigable} showPins={showPins} onPinToggle={reloadPins} />
                }
              />
            ))}
          </List.Section>
        )}
        <List.Section title={pinned.length > 0 ? "All" : undefined}>
          {unpinned.map((entry) => (
            <List.Item
              key={entry.fullPath}
              icon={{ fileIcon: entry.fullPath }}
              title={entry.name}
              accessories={entry.isFile && entry.size > 0 ? [{ text: formatSize(entry.size) }] : undefined}
              quickLook={{ path: entry.fullPath }}
              actions={<FileActions entry={entry} navigable={navigable} showPins={showPins} onPinToggle={reloadPins} />}
            />
          ))}
        </List.Section>
      </List>
    );
  }

  return (
    <Grid columns={Number.parseInt(layout, 10)} inset={Grid.Inset.Small} aspectRatio="4/3">
      {pinned.length > 0 && (
        <Grid.Section title="Pinned">
          {pinned.map((entry) => (
            <Grid.Item
              key={entry.fullPath}
              content={{ fileIcon: entry.fullPath }}
              title={entry.name}
              actions={<FileActions entry={entry} navigable={navigable} showPins={showPins} onPinToggle={reloadPins} />}
            />
          ))}
        </Grid.Section>
      )}
      <Grid.Section title={pinned.length > 0 ? "All" : undefined}>
        {unpinned.map((entry) => (
          <Grid.Item
            key={entry.fullPath}
            content={{ fileIcon: entry.fullPath }}
            title={entry.name}
            subtitle={entry.isFile && entry.size > 0 ? formatSize(entry.size) : undefined}
            actions={<FileActions entry={entry} navigable={navigable} showPins={showPins} onPinToggle={reloadPins} />}
          />
        ))}
      </Grid.Section>
    </Grid>
  );
}
