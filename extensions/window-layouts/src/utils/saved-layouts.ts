import { LocalStorage } from "@raycast/api";

const STORAGE_KEY = "saved-layouts";

export type SavedWindow = Readonly<{
  appName: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}>;

export type SavedLayout = Readonly<{
  name: string;
  windows: SavedWindow[];
  savedAt: string;
}>;

export async function getSavedLayouts(): Promise<SavedLayout[]> {
  const raw = await LocalStorage.getItem<string>(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedLayout[];
  } catch {
    return [];
  }
}

export async function saveLayout(layout: SavedLayout): Promise<void> {
  const layouts = await getSavedLayouts();
  const existing = layouts.findIndex((l) => l.name === layout.name);
  if (existing >= 0) {
    layouts[existing] = layout;
  } else {
    layouts.push(layout);
  }
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
}

export async function deleteSavedLayout(name: string): Promise<void> {
  const layouts = await getSavedLayouts();
  const filtered = layouts.filter((l) => l.name !== name);
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
