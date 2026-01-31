# Changelog

## 0.0.7
- Make repo public

## 0.0.5
- Keywords

## 0.0.4

- **Internal refactor (DRY, KISS):** config resolution moved to `getConfig()` in `PopoverConfig`; `Popover.configure()` uses a single loop over runtime keys instead of repeated `if` blocks.
- **Popover3DRenderer:** `getCanvasFontSize(fontSize)` helper (removes duplicated `fontSize * 2`); positioning mode check uses `Popover3DPositioningMode` enum.
- **Exports:** `getConfig` and `PopoverRuntimeOverrideKey` added to public API for advanced usage. No breaking changes; existing consumers (e.g. gardener) keep the same usage.

## 0.0.3

- `Popover.configure({ positioningMode3D? })` – set default 3D positioning (BILLBOARD or VERTICAL) for all `showText3D()` calls.

## 0.0.2

- `Popover.configure({ fontFamily?, fontSize? })` – set project-wide defaults before `getInstance()`.
- Default font in package is Helvetica; projects can override (e.g. Jingleberry) via `configure()`.
- Export `PopoverConfigureOptions` type.

## 0.0.1

- Initial release: 2D (screen) and 3D (Billboard / Diegetic) popovers, queue, config.
