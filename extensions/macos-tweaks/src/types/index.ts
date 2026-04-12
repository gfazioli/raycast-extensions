export type TweakCategory =
  | "finder"
  | "dock"
  | "screenshots"
  | "desktop"
  | "animations"
  | "keyboard"
  | "trackpad"
  | "safari"
  | "mail"
  | "security"
  | "menubar"
  | "apps"
  | "misc";

export type TweakType = "boolean" | "string" | "number" | "enum";

export type EnumOption = {
  title: string;
  value: string | number;
};

export type TweakRisk = "safe" | "moderate";

export interface TweakDefinition {
  id: string;
  title: string;
  description: string;
  category: TweakCategory;
  domain: string;
  key: string;
  type: TweakType;
  defaultValue: unknown;
  options?: EnumOption[];
  min?: number;
  max?: number;
  requiresRestart?: string;
  minMacOS?: string;
  risk: TweakRisk;
  tags: string[];
  /** Some tweaks need multiple commands — extra domain/key pairs to also set */
  extraDefaults?: { domain: string; key: string; value: unknown }[];
}

export interface TweakState extends TweakDefinition {
  currentValue: unknown;
  isModified: boolean;
}

export const CATEGORY_META: Record<TweakCategory, { title: string; icon: string }> = {
  finder: { title: "Finder", icon: "folder" },
  dock: { title: "Dock", icon: "app-window" },
  screenshots: { title: "Screenshots", icon: "image" },
  desktop: { title: "Desktop & Spaces", icon: "desktop-computer" },
  animations: { title: "Animations", icon: "bolt" },
  keyboard: { title: "Keyboard & Input", icon: "text-cursor" },
  trackpad: { title: "Trackpad & Mouse", icon: "cursor-ray" },
  safari: { title: "Safari", icon: "globe-01" },
  mail: { title: "Mail", icon: "envelope" },
  security: { title: "Security & Privacy", icon: "lock" },
  menubar: { title: "Menu Bar & UI", icon: "bar-chart-01" },
  apps: { title: "Apps", icon: "app-window-grid-3x3" },
  misc: { title: "Miscellaneous", icon: "gear" },
};
