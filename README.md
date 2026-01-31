# babylonjs-popover

Lightweight 3D popover component for Babylon.js: short-lived text in the scene (damage numbers, pickups, etc.).

## Modes

- **3D Billboard** – text in the scene that always faces the camera. Use `Popover3DPositioningMode.BILLBOARD`.
- **3D Vertical** – text in the scene, upright (vertical to ground); rotates only around Y to face camera at creation, then stays fixed. Use `Popover3DPositioningMode.VERTICAL`.

## Install

```bash
npm i babylonjs-popover
# or
yarn add babylonjs-popover
```

## Usage

### 3D popover (Billboard or Vertical)

```typescript
import Popover, { Popover3DPositioningMode } from 'babylonjs-popover'
import { Scene, Vector3 } from 'babylonjs'

const popover = Popover.getInstance()

// Billboard: always faces the camera
await popover.showText3D('-10%', scene, position, 'rgba(255,80,80,0.9)', 'rgba(0,0,0,0.85)', 2)

// Vertical: upright, fixed orientation (Y-only rotation at creation)
await popover.showText3D(
  '+1 Apple',
  scene,
  position,
  'rgba(200,208,198,0.95)',
  'rgba(0,0,0,0.85)',
  2,
  Popover3DPositioningMode.VERTICAL
)
```

### Project-wide defaults (font, size)

Call `configure()` once before any `getInstance()` so the singleton uses your defaults:

```typescript
import Popover from 'babylonjs-popover'

Popover.configure({ fontFamily: 'Helvetica', fontSize: 24 })
const popover = Popover.getInstance()
```

### Per-instance font and size

```typescript
popover.setFontFamily('YourFont')
popover.setFontSize(24)
```

### 3D texture width (avoid clipping last character)

Width is measured with `CanvasRenderingContext2D.measureText()` for the actual font, then multiplied by a padding factor (default 1.2 = 20% extra). If the last letter still clips (e.g. with some fonts), increase the factor:

```typescript
Popover.configure({
  fontFamily: 'Helvetica',
  textureWidthPaddingFactor: 1.3,  // e.g. 30% extra width
  // texture3DMinWidth: 256,
  // texture3DMaxWidth: 1024,
})
```

### Configure: 3D animation and rendering

All 3D defaults from `POPOVER_CONFIG` can be overridden via `Popover.configure()` (call before `getInstance()`). Example with common 3D options:

```typescript
import Popover, { Popover3DPositioningMode } from 'babylonjs-popover'

Popover.configure({
  fontFamily: 'Helvetica',
  fontSize: 24,
  positioningMode3D: Popover3DPositioningMode.VERTICAL,
  // 3D animation
  animationOffsetY3D: 3.5,      // vertical offset (world units) during fade-out
  scaleFactor3D: 1.2,            // end scale multiplier
  animationSpeed3D: 40,          // ms per animation step
  alphaFadeStart3D: 0.7,         // start fade at 70% of duration (0–1)
  alphaFadeDuration3D: 800,     // fade duration in ms
  // 3D rendering
  textureAlpha3D: 0.8,
  planeBaseHeight3D: 1,
  renderingGroupId3D: 2,
  // texture size (if needed)
  textureWidthPaddingFactor: 1.2,
  texture3DMinWidth: 256,
  texture3DMaxWidth: 1024,
})

const popover = Popover.getInstance()
```

## License

This project is licensed under the **Apache License 2.0**.