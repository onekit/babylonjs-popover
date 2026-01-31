import { Scene, Vector3 } from 'babylonjs'
import { PopoverRenderer } from './PopoverRenderer'
import { PopoverAnimator } from './PopoverAnimator'
import { PopoverQueue } from './PopoverQueue'
import {
  POPOVER_CONFIG,
  Popover3DPositioningMode,
  popoverRuntimeOverrides,
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
}

/**
 * Popover - coordinates 2D (screen) and 3D (Billboard / Diegetic) popover text.
 * Use showText for 2D fullscreen; use showText3D for 3D in-scene (Billboard or Diegetic).
 * Call configure() once at app init to set project-wide defaults (e.g. font family).
 */
export class Popover {
  private static instance: Popover
  private static configured: PopoverConfigureOptions = {}
  private fontFamily = POPOVER_CONFIG.DEFAULT_FONT_FAMILY
  private fontSize = POPOVER_CONFIG.DEFAULT_FONT_SIZE

  private renderer: PopoverRenderer
  private animator: PopoverAnimator
  private queue: PopoverQueue
  private renderer3D: Popover3DRenderer | undefined

  constructor(
    renderer: PopoverRenderer = new PopoverRenderer(),
    animator: PopoverAnimator = new PopoverAnimator(),
    queue: PopoverQueue = new PopoverQueue(),
  ) {
    this.renderer = renderer
    this.animator = animator
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

  setOnPanelCreated(callback: ((panelName: string) => void) | undefined): void {
    this.renderer.setOnPanelCreated(callback)
  }

  async showText(
    text: string,
    color = 'rgba(205,205,205,0.78)',
    outlineColor = 'rgba(0,0,0,0.78)',
    outlineWidth = 3,
  ): Promise<void> {
    return this.queue.add(async () => {
      const textElement = this.renderer.create(
        this.fontFamily,
        this.fontSize,
        color,
        outlineColor,
        outlineWidth,
      )
      textElement.text = text
      await this.animator.animateHide(textElement)
      this.renderer.dispose()
    })
  }

  /**
   * Show 3D popover at world position.
   * @param positioningMode - BILLBOARD (always face camera) or DIEGETIC (in-world, fixed orientation).
   */
  async showText3D(
    text: string,
    scene: Scene,
    position: Vector3,
    color = 'rgba(205,205,205,0.78)',
    outlineColor = 'rgba(0,0,0,0.78)',
    outlineWidth = 3,
    positioningMode: Popover3DPositioningMode = POPOVER_CONFIG.POSITIONING_MODE_3D,
  ): Promise<void> {
    return this.queue.add(async () => {
      if (!this.renderer3D) {
        this.renderer3D = new Popover3DRenderer()
      }

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
        positioningMode,
      )

      await animator3D.animateHide(mesh)
      this.renderer3D.dispose()
      this.renderer3D = undefined
    })
  }

  dispose(): void {
    this.renderer.dispose()
  }

  /**
   * Set project-wide defaults (e.g. font family, texture padding). Call before getInstance().
   */
  static configure(options: PopoverConfigureOptions): void {
    Popover.configured = { ...Popover.configured, ...options }
    if (options.textureWidthPaddingFactor !== undefined)
      popoverRuntimeOverrides.textureWidthPaddingFactor = options.textureWidthPaddingFactor
    if (options.texture3DMinWidth !== undefined)
      popoverRuntimeOverrides.texture3DMinWidth = options.texture3DMinWidth
    if (options.texture3DMaxWidth !== undefined)
      popoverRuntimeOverrides.texture3DMaxWidth = options.texture3DMaxWidth
  }

  static getInstance(fontFamily?: string): Popover {
    if (!Popover.instance) {
      Popover.instance = new Popover()
      const family = fontFamily ?? Popover.configured.fontFamily ?? POPOVER_CONFIG.DEFAULT_FONT_FAMILY
      const size = Popover.configured.fontSize ?? POPOVER_CONFIG.DEFAULT_FONT_SIZE
      Popover.instance.setFontFamily(family)
      Popover.instance.setFontSize(size)
    }
    return Popover.instance
  }
}

export default Popover
