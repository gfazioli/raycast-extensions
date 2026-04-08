import { getPreferenceValues } from "@raycast/api";

type UserPreferences = Readonly<{
  gap: number;
  disableToasts: boolean;
  keepWindowOpenAfterTiling: boolean;
  excludedApps: string[];
}>;

export function getUserPreferences(): UserPreferences {
  const userPreferences = getPreferenceValues();
  const gap = parseInt(userPreferences.gap as string, 10);
  const rawExcluded = (userPreferences.excludedApps as string) ?? "";

  return {
    gap: Number.isNaN(gap) ? 0 : gap,
    disableToasts: Boolean(userPreferences.disableToasts),
    keepWindowOpenAfterTiling: Boolean(userPreferences.keepWindowOpenAfterTiling),
    excludedApps: rawExcluded
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  };
}
