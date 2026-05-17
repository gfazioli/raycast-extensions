# macOS Tweaks Changelog

## [More Tweaks & Sound Category] - {PR_MERGE_DATE}

### New Category
- **Sound**: toggle UI sound effects and volume change feedback beep

### New Tweaks (35)
- **Dock**: Magnification + Magnification Size, Show Only Open Apps (`static-only`), Launch Bounce Animation, Group Windows by App in Mission Control, Highlight Stack Items on Hover
- **Finder**: Allow Quitting Finder, Auto-Empty Trash After 30 Days, Show Hard/External/Removable/Mounted Servers on Desktop
- **Keyboard**: Press-and-Hold Key Repeat (Vim-friendly), Full Keyboard Access, Double-Space to Period
- **Trackpad & Mouse**: Mouse Tracking Speed, Tap-and-Drag (Drag Lock), Two-Finger Secondary Click
- **Screenshots**: Filename Prefix (Screenshot / Screen / Capture / Snap / Shot)
- **Safari**: Internal Debug Menu, Disable Search Engine Suggestions, Always Restore Session at Launch
- **Menu Bar & UI**: Show Sound, Battery Percentage, AirDrop, Screen Mirroring, Focus, Now Playing, Fast User Switching in the menu bar
- **Animations**: Reduce Motion and Reduce Transparency — perceived performance on older Macs

### Improvements
- Detail view now displays macOS version constraints (`minMacOS` / `maxMacOS`) when set on a tweak

## [Initial Version] - 2026-04-30

- Browse Tweaks: list and toggle 73 hidden macOS settings across 13 categories
- My Tweaks: view modified settings, reset individually or all at once, export as shell commands
- Tweaks Menu Bar: quick access and toggle from the menu bar
- Detail panel with description, current/default values, domain, key, and full `defaults write` command
- Filter by category or status (All / Modified / Default)
- One-click toggle for boolean settings, dropdown for enum settings
- Safety warnings for moderate-risk tweaks
- Automatic process restart (Finder, Dock, SystemUIServer) after changes
