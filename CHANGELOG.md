# Changelog

## 0.0.4

- **Breaking:** Removed 2D (screen-space) popover and `babylonjs-gui` dependency. Package is 3D-only and lighter.
- Removed `PopoverRenderer`, `PopoverAnimator`, `showText()`, `setOnPanelCreated()`, `OnPanelCreatedCallback`, `PopoverAnimationConfig`.
- Removed from config: `PADDING_BOTTOM`, `PIXEL_STEP`, `FONT_SIZE_STEP`.

## 0.0.3

- `Popover.configure({ positioningMode3D? })` – set default 3D positioning (BILLBOARD or VERTICAL) for all `showText3D()` calls.

## 0.0.2

- `Popover.configure({ fontFamily?, fontSize? })` – set project-wide defaults before `getInstance()`.
- Default font in package is Helvetica; projects can override (e.g. Jingleberry) via `configure()`.
- Export `PopoverConfigureOptions` type.

## 0.0.1

- Initial release: 2D (screen) and 3D (Billboard / Diegetic) popovers, queue, config.
