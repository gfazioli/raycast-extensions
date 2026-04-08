import { LocalStorage } from "@raycast/api";

const STORAGE_KEY = "custom-layouts";

export type CustomLayout = Readonly<{
  name: string;
  grid: number[][];
  createdAt: string;
}>;

export async function getCustomLayouts(): Promise<CustomLayout[]> {
  const raw = await LocalStorage.getItem<string>(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CustomLayout[];
  } catch {
    return [];
  }
}

export async function saveCustomLayout(layout: CustomLayout): Promise<void> {
  const all = await getCustomLayouts();
  const existing = all.findIndex((l) => l.name === layout.name);
  if (existing >= 0) {
    all[existing] = layout;
  } else {
    all.push(layout);
  }
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export async function deleteCustomLayout(name: string): Promise<void> {
  const all = await getCustomLayouts();
  const filtered = all.filter((l) => l.name !== name);
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
