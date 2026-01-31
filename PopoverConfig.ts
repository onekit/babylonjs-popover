// 3D popover positioning modes: Billboard (always face camera) or Vertical (upright, Y-only rotation at creation)
export enum Popover3DPositioningMode {
  BILLBOARD = 'billboard',
  /** Vertical: plane upright (vertical to ground), rotates only around Y to face camera at creation, then stays fixed. */
  VERTICAL = 'vertical',
}

// Configuration constants for 3D popover
export const POPOVER_CONFIG = {
  DEFAULT_FONT_SIZE: 22,
  DEFAULT_FONT_FAMILY: 'Helvetica',
  ANIMATION_STEPS: 24,
  ANIMATION_SPEED: 40,
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

/** Runtime overrides (e.g. from Popover.configure()). Used by renderers and animators. */
export const popoverRuntimeOverrides: {
  textureWidthPaddingFactor?: number
  texture3DMinWidth?: number
  texture3DMaxWidth?: number
  animationOffsetY3D?: number
  scaleFactor3D?: number
  planeBaseHeight3D?: number
  renderingGroupId3D?: number
  textureAlpha3D?: number
  animationSpeed3D?: number
  alphaFadeStart3D?: number
  alphaFadeDuration3D?: number
} = {}
