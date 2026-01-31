import { AbstractMesh, Scene, StandardMaterial, Vector3 } from 'babylonjs'
import { POPOVER_CONFIG } from './PopoverConfig'

/**
 * Popover3DAnimator - animates 3D popover mesh: fade out, move up, scale.
 */
export class Popover3DAnimator {
  constructor(private readonly scene: Scene) {}

  async animateHide(mesh: AbstractMesh): Promise<void> {
    const material = mesh.material as StandardMaterial | null

    const startAlpha = material ? material.alpha : 1
    const startPosition = mesh.position.clone()
    const startScale = mesh.scaling.x

    const endAlpha = 0
    const endPosition = startPosition.add(
      new Vector3(0, POPOVER_CONFIG.ANIMATION_OFFSET_Y_3D ?? 1.5, 0),
    )
    const endScale = startScale * (POPOVER_CONFIG.SCALE_FACTOR_3D ?? 1.2)

    const duration =
      POPOVER_CONFIG.ANIMATION_STEPS *
      (POPOVER_CONFIG.ANIMATION_SPEED_3D ?? POPOVER_CONFIG.ANIMATION_SPEED)

    return this.animate(
      mesh,
      material,
      startAlpha,
      endAlpha,
      startPosition,
      endPosition,
      startScale,
      endScale,
      duration,
    )
  }

  private animate(
    mesh: AbstractMesh,
    material: StandardMaterial | null,
    startAlpha: number,
    endAlpha: number,
    startPos: Vector3,
    endPos: Vector3,
    startScale: number,
    endScale: number,
    duration: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now()
      const fadeStart = POPOVER_CONFIG.ALPHA_FADE_START_3D ?? 0.6
      const fadeDuration = POPOVER_CONFIG.ALPHA_FADE_DURATION_3D ?? 600
      const fadeStartTime = duration * fadeStart
      const fadeEndTime = Math.min(fadeStartTime + fadeDuration, duration)

      const observer = this.scene.onBeforeRenderObservable.add(() => {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = this.easeOut(progress)

        let alphaProgress = 0
        if (elapsed > fadeStartTime) {
          const fadeElapsed = elapsed - fadeStartTime
          const fadeTotal = fadeEndTime - fadeStartTime
          alphaProgress = Math.min(fadeElapsed / fadeTotal, 1)
        }
        const alphaEased = this.easeOut(alphaProgress)
        const alpha = startAlpha + (endAlpha - startAlpha) * alphaEased
        if (material) material.alpha = alpha

        mesh.position = Vector3.Lerp(startPos, endPos, easedProgress)

        const scale = startScale + (endScale - startScale) * easedProgress
        mesh.scaling = new Vector3(scale, scale, scale)

        if (progress >= 1) {
          this.scene.onBeforeRenderObservable.remove(observer)
          resolve()
        }
      })
    })
  }

  private easeOut(t: number): number {
    return 1 - (1 - t) * (1 - t)
  }
}
