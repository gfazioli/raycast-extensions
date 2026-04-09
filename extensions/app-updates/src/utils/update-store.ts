import { LocalStorage } from "@raycast/api";
import type { AppUpdate } from "./types";

const STORAGE_KEY = "shared-updates";

export async function getStoredUpdates(): Promise<AppUpdate[]> {
  const raw = await LocalStorage.getItem<string>(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AppUpdate[];
  } catch {
    return [];
  }
}

export async function storeUpdates(updates: AppUpdate[]): Promise<void> {
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
}
