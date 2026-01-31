import {
  AbstractMesh,
  Color3,
  DynamicTexture,
  Engine,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from 'babylonjs'
import {
  POPOVER_CONFIG,
  Popover3DPositioningMode,
  popoverRuntimeOverrides,
} from './PopoverConfig'

interface Popover3DTextureSize {
  width: number
  height: number
}

/**
 * Popover3DRenderer - creates 3D popover meshes with text textures.
 * Supports Billboard (always face camera) and Diegetic (in-world, fixed orientation) modes.
 */
export class Popover3DRenderer {
  private mesh: AbstractMesh | undefined
  private material: StandardMaterial | undefined
  private texture: DynamicTexture | undefined

  create(
    scene: Scene,
    position: Vector3,
    text: string,
    fontFamily: string,
    fontSize: number,
    color: string,
    outlineColor: string,
    outlineWidth: number,
    positioningMode: Popover3DPositioningMode | 'billboard' | 'vertical' = POPOVER_CONFIG.POSITIONING_MODE_3D,
  ): AbstractMesh {
    const textureSize = this.calculateTextureSize(text, fontFamily, fontSize)

    this.texture = new DynamicTexture('popover3DTexture', textureSize, scene, false)
    this.texture.hasAlpha = true

    this.drawTextOnTexture(text, fontFamily, fontSize, color, outlineColor, outlineWidth)

    this.material = new StandardMaterial('popover3DMaterial', scene)
    this.material.diffuseTexture = this.texture
    this.material.opacityTexture = this.texture
    this.material.useAlphaFromDiffuseTexture = true
    this.material.emissiveTexture = this.texture
    this.material.emissiveColor = new Color3(1, 1, 1)
    this.material.alpha =
      popoverRuntimeOverrides.textureAlpha3D ?? POPOVER_CONFIG.TEXTURE_ALPHA_3D ?? 0.6
    this.material.backFaceCulling = false
    this.material.disableLighting = true
    this.material.alphaMode = Engine.ALPHA_COMBINE

    const planeSize = this.calculatePlaneSize(textureSize)
    this.mesh = MeshBuilder.CreatePlane(
      'popover3DMesh',
      { width: planeSize.width, height: planeSize.height },
      scene,
    )

    this.mesh.position = position.clone()
    this.mesh.material = this.material

    const mode = String(positioningMode)
    const isBillboard = mode === 'billboard'
    const isVertical = mode === 'vertical'

    if (isBillboard) {
      this.mesh.billboardMode = AbstractMesh.BILLBOARDMODE_ALL
    } else {
      this.mesh.billboardMode = AbstractMesh.BILLBOARDMODE_NONE
      if (isVertical) {
        this.rotateToFaceCameraVertical(scene, this.mesh, position)
      }
    }

    this.mesh.renderingGroupId =
      popoverRuntimeOverrides.renderingGroupId3D ?? POPOVER_CONFIG.RENDERING_GROUP_ID_3D ?? 2

    return this.mesh
  }

  dispose(): void {
    if (this.mesh) {
      this.mesh.dispose()
      this.mesh = undefined
    }
    if (this.material) {
      this.material.dispose()
      this.material = undefined
    }
    if (this.texture) {
      this.texture.dispose()
      this.texture = undefined
    }
  }

  private calculateTextureSize(
    text: string,
    fontFamily: string,
    fontSize: number,
  ): Popover3DTextureSize {
    const canvasFontSize = fontSize * 2
    const measuredWidth = this.measureTextWidth(text, fontFamily, canvasFontSize)
    const paddingFactor =
      popoverRuntimeOverrides.textureWidthPaddingFactor ??
      POPOVER_CONFIG.TEXTURE_3D_WIDTH_PADDING_FACTOR ??
      1.2
    const minW =
      popoverRuntimeOverrides.texture3DMinWidth ??
      POPOVER_CONFIG.TEXTURE_3D_MIN_WIDTH ??
      256
    const maxW =
      popoverRuntimeOverrides.texture3DMaxWidth ??
      POPOVER_CONFIG.TEXTURE_3D_MAX_WIDTH ??
      1024
    const widthWithPadding = Math.ceil(measuredWidth * paddingFactor)
    const clampedWidth = Math.min(maxW, Math.max(minW, widthWithPadding))
    const height = fontSize * 3
    return {
      width: this.nextPowerOfTwo(clampedWidth),
      height: this.nextPowerOfTwo(height),
    }
  }

  /** Measure text width with canvas (same font as draw) to avoid clipping. */
  private measureTextWidth(text: string, fontFamily: string, fontSizePx: number): number {
    if (typeof document === 'undefined' || !document.createElement) {
      return Math.max(64, text.length * fontSizePx * 0.5)
    }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return Math.max(64, text.length * fontSizePx * 0.5)
    ctx.font = `${fontSizePx}px ${fontFamily}`
    const metrics = ctx.measureText(text)
    return metrics.width
  }

  private calculatePlaneSize(textureSize: Popover3DTextureSize): { width: number; height: number } {
    const baseHeight =
      (popoverRuntimeOverrides.planeBaseHeight3D ?? POPOVER_CONFIG.PLANE_BASE_HEIGHT_3D ?? 1) * 3
    const aspectRatio = textureSize.width / textureSize.height
    return {
      width: baseHeight * aspectRatio,
      height: baseHeight,
    }
  }

  private drawTextOnTexture(
    text: string,
    fontFamily: string,
    fontSize: number,
    color: string,
    outlineColor: string,
    outlineWidth: number,
  ): void {
    if (!this.texture) return

    const context = this.texture.getContext()
    const size = this.texture.getSize()

    context.clearRect(0, 0, size.width, size.height)

    const canvasFontSize = fontSize * 2
    context.font = `${canvasFontSize}px ${fontFamily}`
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    const centerX = size.width / 2
    const centerY = size.height / 2

    context.save()
    context.translate(0, size.height)
    context.scale(1, -1)

    if (outlineWidth > 0) {
      context.lineWidth = outlineWidth * 2
      context.strokeStyle = outlineColor
      context.strokeText(text, centerX, centerY)
    }

    context.fillStyle = color
    context.fillText(text, centerX, centerY)

    context.restore()

    this.texture.update(false)
  }

  private nextPowerOfTwo(value: number): number {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.log(2)))
  }

  /** Vertical: rotate only around Y so the plane is upright and faces camera direction in the horizontal plane. */
  private rotateToFaceCameraVertical(scene: Scene, mesh: AbstractMesh, position: Vector3): void {
    const camera = scene.activeCamera
    if (!camera) return

    const direction = camera.position.clone().subtract(position)
    const angleY = Math.atan2(direction.x, direction.z) + Math.PI
    mesh.rotation.y = angleY
  }

}
