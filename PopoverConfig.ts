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
  DEFAULT_FONT_FAMILY: 'Helvetica',
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
} as const

export interface PopoverAnimationConfig {
  startAlpha: number
  endAlpha: number
  startPadding: number
  endPadding: number
  startFontSize: number
  endFontSize: number
  duration: number
}
