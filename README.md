# babylonjs-popover

Lightweight 3D and 2D popover components for Babylon.js: short-lived text above the action (damage numbers, pickups, etc.).

## Modes

- **2D (screen-space)** – fullscreen UI text at the bottom (Babylon.js GUI).
- **3D Billboard** – text in the scene that always faces the camera.
- **3D Diegetic** – text in the scene with fixed orientation (vertical to ground, faces camera at creation time). Use `Popover3DPositioningMode.DIEGETIC` or `Popover3DPositioningMode.VERTICAL`.

## Install

```bash
npm i babylonjs-popover
# or
yarn add babylonjs-popover
```

## Usage

### 3D popover (Billboard or Diegetic)

```typescript
import Popover, { Popover3DPositioningMode } from 'babylonjs-popover'
import { Scene, Vector3 } from 'babylonjs'

const popover = Popover.getInstance()

// Billboard: always faces the camera
await popover.showText3D('-10%', scene, position, 'rgba(255,80,80,0.9)', 'rgba(0,0,0,0.85)', 2)

// Diegetic: in-world, fixed orientation
await popover.showText3D(
  '+1 Apple',
  scene,
  position,
  'rgba(200,208,198,0.95)',
  'rgba(0,0,0,0.85)',
  2,
  Popover3DPositioningMode.DIEGETIC
)
```

### 2D popover (screen-space)

```typescript
import Popover from 'babylonjs-popover'

const popover = Popover.getInstance()
await popover.showText('Damage -10%', 'rgba(205,205,205,0.78)', 'rgba(0,0,0,0.78)', 3)
```

### Optional: notify when a panel is created (e.g. to keep cursor on top)

```typescript
popover.setOnPanelCreated((panelName) => {
  // Your UI layer manager, e.g. CustomCursor.ensureOnTop()
})
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
  fontFamily: 'Jingleberry',
  textureWidthPaddingFactor: 1.3,  // e.g. 30% extra width
  // texture3DMinWidth: 256,
  // texture3DMaxWidth: 1024,
})
```

## Local development (test without publishing to npm)

**Option A – `file:` dependency and same repo parent in Docker**

1. Put `babylonjs-popover` next to your app (e.g. `your-app/` and `your-app/../babylonjs-popover/`).
2. In your app’s `package.json`: `"babylonjs-popover": "file:../babylonjs-popover"`.
3. In Docker, mount the parent so both paths exist, e.g. in `docker-compose.yml`:
   ```yaml
   volumes:
     - .:/usr/src/app
     - ../babylonjs-popover:/usr/src/babylonjs-popover
   ```
   and in `package.json` use `"file:/usr/src/babylonjs-popover"` only for local/Docker runs, or keep `file:../babylonjs-popover` and mount parent: `- ..:/usr/src` with `working_dir: /usr/src/app`.

**Option B – `yarn link` (host only, not inside Docker)**

```bash
# In babylonjs-popover
yarn link

# In your app (on the host)
yarn link babylonjs-popover
```

Then run your app on the host (e.g. `yarn dev`). To switch back to the published package: `yarn unlink babylonjs-popover` and `yarn install`.

## API

- `Popover.configure({ fontFamily?, fontSize?, textureWidthPaddingFactor?, texture3DMinWidth?, texture3DMaxWidth? })` – set project-wide defaults (call before `getInstance()`).
- `Popover.getInstance(fontFamily?)` – singleton.
- `showText(text, color?, outlineColor?, outlineWidth?)` – 2D fullscreen popover (requires `babylonjs-gui`).
- `showText3D(text, scene, position, color?, outlineColor?, outlineWidth?, positioningMode?)` – 3D popover; `positioningMode`: `BILLBOARD` (default) or `DIEGETIC` / `VERTICAL`.
- `setOnPanelCreated(callback?)` – called when 2D panel is created (for layer ordering).
- `setFontFamily`, `setFontSize`, `getFontFamily`, `getFontSize`, `dispose`.

## Exports

- `Popover` (default), `PopoverRenderer`, `PopoverAnimator`, `PopoverQueue`
- `Popover3DRenderer`, `Popover3DAnimator`
- `POPOVER_CONFIG`, `Popover3DPositioningMode`, `PopoverAnimationConfig`, `OnPanelCreatedCallback`

## Dependencies

- `babylonjs` ^7
- `babylonjs-gui` ^7 (for 2D popover only)
