import { Scene, Vector3 } from 'babylonjs'
import { PopoverQueue } from './PopoverQueue'
import {
  POPOVER_CONFIG,
  Popover3DPositioningMode,
  popoverRuntimeOverrides,
  type PopoverRuntimeOverrideKey,
} from './PopoverConfig'
import { Popover3DRenderer } from './Popover3DRenderer'
import { Popover3DAnimator } from './Popover3DAnimator'

export interface PopoverConfigureOptions {
  fontFamily?: string
  fontSize?: number
  /** Extra width for 3D texture (multiplier on measured width). Default 1.2. */
  textureWidthPaddingFactor?: number
  texture3DMinWidth?: number
  texture3DMaxWidth?: number
  /** Default 3D positioning: BILLBOARD (always face camera) or VERTICAL (upright, Y-only at creation). */
  positioningMode3D?: Popover3DPositioningMode
  /** 3D animation: vertical offset (world units). Default from POPOVER_CONFIG.ANIMATION_OFFSET_Y_3D. */
  animationOffsetY3D?: number
  /** 3D animation: scale factor at end. Default from POPOVER_CONFIG.SCALE_FACTOR_3D. */
  scaleFactor3D?: number
  /** 3D plane base height. Default from POPOVER_CONFIG.PLANE_BASE_HEIGHT_3D. */
  planeBaseHeight3D?: number
  /** 3D rendering group id. Default from POPOVER_CONFIG.RENDERING_GROUP_ID_3D. */
  renderingGroupId3D?: number
  /** 3D texture alpha. Default from POPOVER_CONFIG.TEXTURE_ALPHA_3D. */
  textureAlpha3D?: number
  /** 3D animation speed (ms per step). Default from POPOVER_CONFIG.ANIMATION_SPEED_3D. */
  animationSpeed3D?: number
  /** 3D fade start (0–1 of duration). Default from POPOVER_CONFIG.ALPHA_FADE_START_3D. */
  alphaFadeStart3D?: number
  /** 3D fade duration (ms). Default from POPOVER_CONFIG.ALPHA_FADE_DURATION_3D. */
  alphaFadeDuration3D?: number
}

/**
 * Popover - 3D popover text (Billboard or Vertical). Use showText3D for in-scene popovers.
 * Call configure() once at app init to set project-wide defaults (e.g. font family).
 */
export class Popover {
  private static instance: Popover
  private static configured: PopoverConfigureOptions = {}
  private fontFamily: string = POPOVER_CONFIG.DEFAULT_FONT_FAMILY
  private fontSize: number = POPOVER_CONFIG.DEFAULT_FONT_SIZE
  /** Instance default for 3D mode (set from configure when getInstance runs). */
  private defaultPositioningMode3D: Popover3DPositioningMode = POPOVER_CONFIG.POSITIONING_MODE_3D

  private queue: PopoverQueue
  private renderer3D: Popover3DRenderer | undefined

  constructor(queue: PopoverQueue = new PopoverQueue()) {
    this.queue = queue
  }

  setFontSize(fontSize: number): void {
    this.fontSize = fontSize
  }

  getFontSize(): number {
    return this.fontSize
  }

  setFontFamily(fontFamily: string): void {
    this.fontFamily = fontFamily
  }

  getFontFamily(): string {
    return this.fontFamily
  }

  /**
   * Show 3D popover at world position.
   * @param positioningMode - BILLBOARD (always face camera) or VERTICAL (upright, Y-only at creation).
   */
  async showText3D(
    text: string,
    scene: Scene,
    position: Vector3,
    color = 'rgba(205,205,205,0.78)',
    outlineColor = 'rgba(0,0,0,0.78)',
    outlineWidth = 3,
    positioningMode?: Popover3DPositioningMode,
  ): Promise<void> {
    return this.queue.add(async () => {
      if (!this.renderer3D) {
        this.renderer3D = new Popover3DRenderer()
      }

      const mode: Popover3DPositioningMode =
        positioningMode ?? this.defaultPositioningMode3D ?? POPOVER_CONFIG.POSITIONING_MODE_3D

      const animator3D = new Popover3DAnimator(scene)
      const mesh = this.renderer3D.create(
        scene,
        position,
        text,
        this.fontFamily,
        this.fontSize,
        color,
        outlineColor,
        outlineWidth,
        mode,
      )

      await animator3D.animateHide(mesh)
      this.renderer3D.dispose()
      this.renderer3D = undefined
    })
  }

  dispose(): void {
    if (this.renderer3D) {
      this.renderer3D.dispose()
      this.renderer3D = undefined
    }
  }

  /**
   * Set project-wide defaults (e.g. font family, texture padding). Call before getInstance().
   */
  static configure(options: PopoverConfigureOptions): void {
    Popover.configured = { ...Popover.configured, ...options }
    if (options.positioningMode3D !== undefined && Popover.instance) {
      Popover.instance.defaultPositioningMode3D = options.positioningMode3D
    }
    const runtimeKeys: PopoverRuntimeOverrideKey[] = [
      'textureWidthPaddingFactor',
      'texture3DMinWidth',
      'texture3DMaxWidth',
      'animationOffsetY3D',
      'scaleFactor3D',
      'planeBaseHeight3D',
      'renderingGroupId3D',
      'textureAlpha3D',
      'animationSpeed3D',
      'alphaFadeStart3D',
      'alphaFadeDuration3D',
    ]
    for (const key of runtimeKeys) {
      const value = options[key]
      if (value !== undefined) {
        popoverRuntimeOverrides[key] = value
      }
    }
  }

  static getInstance(fontFamily?: string): Popover {
    if (!Popover.instance) {
      Popover.instance = new Popover()
      const family = fontFamily ?? Popover.configured.fontFamily ?? POPOVER_CONFIG.DEFAULT_FONT_FAMILY
      const size = Popover.configured.fontSize ?? POPOVER_CONFIG.DEFAULT_FONT_SIZE
      const mode3D = Popover.configured.positioningMode3D ?? POPOVER_CONFIG.POSITIONING_MODE_3D
      Popover.instance.setFontFamily(family)
      Popover.instance.setFontSize(size)
      Popover.instance.defaultPositioningMode3D = mode3D
    }
    return Popover.instance
  }
}

export default Popover
