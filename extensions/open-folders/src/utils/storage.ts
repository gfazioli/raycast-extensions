import { LocalStorage } from "@raycast/api";

const PINNED_KEY = "pinned-folders";
const RECENT_KEY = "recent-folders";
const MAX_RECENT = 20;

export async function getPinnedFolders(): Promise<string[]> {
  const raw = await LocalStorage.getItem<string>(PINNED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function togglePin(path: string): Promise<boolean> {
  const pinned = await getPinnedFolders();
  const index = pinned.indexOf(path);
  if (index >= 0) {
    pinned.splice(index, 1);
    await LocalStorage.setItem(PINNED_KEY, JSON.stringify(pinned));
    return false;
  } else {
    pinned.unshift(path);
    await LocalStorage.setItem(PINNED_KEY, JSON.stringify(pinned));
    return true;
  }
}

export async function getRecentFolders(): Promise<string[]> {
  const raw = await LocalStorage.getItem<string>(RECENT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function addRecentFolder(path: string): Promise<void> {
  const recent = await getRecentFolders();
  const filtered = recent.filter((p) => p !== path);
  filtered.unshift(path);
  await LocalStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, MAX_RECENT)));
}

export async function clearRecentFolders(): Promise<void> {
  await LocalStorage.removeItem(RECENT_KEY);
}
