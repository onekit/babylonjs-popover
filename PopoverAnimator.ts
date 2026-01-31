import * as GUI from 'babylonjs-gui'
import { POPOVER_CONFIG, PopoverAnimationConfig } from './PopoverConfig'

/**
 * PopoverAnimator - animates 2D popover (fade, move up, scale) using requestAnimationFrame.
 */
export class PopoverAnimator {
  private animate(
    text: GUI.TextBlock,
    config: PopoverAnimationConfig,
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now()

      const tick = () => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / config.duration, 1)
        const eased = 1 - (1 - progress) * (1 - progress)

        text.alpha = config.startAlpha + (config.endAlpha - config.startAlpha) * eased
        text.paddingBottomInPixels =
          config.startPadding + (config.endPadding - config.startPadding) * eased
        text.fontSizeInPixels =
          config.startFontSize + (config.endFontSize - config.startFontSize) * eased

        if (progress >= 1) {
          resolve()
          return
        }
        requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    })
  }

  async animateHide(text: GUI.TextBlock): Promise<void> {
    const config: PopoverAnimationConfig = {
      startAlpha: text.alpha,
      endAlpha: 0,
      startPadding: text.paddingBottomInPixels,
      endPadding:
        text.paddingBottomInPixels +
        POPOVER_CONFIG.ANIMATION_STEPS * POPOVER_CONFIG.PIXEL_STEP,
      startFontSize: text.fontSizeInPixels,
      endFontSize:
        text.fontSizeInPixels +
        POPOVER_CONFIG.ANIMATION_STEPS * POPOVER_CONFIG.FONT_SIZE_STEP,
      duration: POPOVER_CONFIG.ANIMATION_STEPS * POPOVER_CONFIG.ANIMATION_SPEED,
    }
    await this.animate(text, config)
  }
}
