// 3D popover positioning modes: Billboard (always face camera) or Diegetic (in-world, fixed orientation)
export enum Popover3DPositioningMode {
  BILLBOARD = 'billboard',
  /** Diegetic: in-world, fixed orientation (faces camera at creation time). */
  DIEGETIC = 'diegetic',
  /** Alias for DIEGETIC: vertical to ground, fixed orientation. */
  VERTICAL = 'vertical',
}

// Configuration constants for Popover components
export const POPOVER_CONFIG = {
  DEFAULT_FONT_SIZE: 22,
  DEFAULT_FONT_FAMILY: 'open sans',
  ANIMATION_STEPS: 24,
  PIXEL_STEP: 2,
  FONT_SIZE_STEP: 0.4,
  ANIMATION_SPEED: 40,
  PADDING_BOTTOM: '35%',
  // 3D popover defaults
  ANIMATION_OFFSET_Y_3D: 2.8,
  SCALE_FACTOR_3D: 1.4,
  PLANE_BASE_HEIGHT_3D: 1,
  RENDERING_GROUP_ID_3D: 2,
  TEXTURE_ALPHA_3D: 0.6,
  ANIMATION_SPEED_3D: 40,
  POSITIONING_MODE_3D: Popover3DPositioningMode.BILLBOARD,
  ALPHA_FADE_START_3D: 0.7,
  ALPHA_FADE_DURATION_3D: 1000,
  /** Extra width for 3D texture (multiplier on measured width) to avoid clipping last character. Default 1.2 = 20% padding. */
  TEXTURE_3D_WIDTH_PADDING_FACTOR: 1.2,
  /** Minimum width (px) for 3D texture. */
  TEXTURE_3D_MIN_WIDTH: 256,
  /** Maximum width (px) for 3D texture. */
  TEXTURE_3D_MAX_WIDTH: 1024,
} as const

/** Runtime overrides (e.g. from Popover.configure()). Used by renderers. */
export const popoverRuntimeOverrides: {
  textureWidthPaddingFactor?: number
  texture3DMinWidth?: number
  texture3DMaxWidth?: number
} = {}

export interface PopoverAnimationConfig {
  startAlpha: number
  endAlpha: number
  startPadding: number
  endPadding: number
  startFontSize: number
  endFontSize: number
  duration: number
}
