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
import { POPOVER_CONFIG, Popover3DPositioningMode } from './PopoverConfig'

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
    positioningMode: Popover3DPositioningMode = POPOVER_CONFIG.POSITIONING_MODE_3D,
  ): AbstractMesh {
    const textureSize = this.calculateTextureSize(text, fontSize)

    this.texture = new DynamicTexture('popover3DTexture', textureSize, scene, false)
    this.texture.hasAlpha = true

    this.drawTextOnTexture(text, fontFamily, fontSize, color, outlineColor, outlineWidth)

    this.material = new StandardMaterial('popover3DMaterial', scene)
    this.material.diffuseTexture = this.texture
    this.material.opacityTexture = this.texture
    this.material.useAlphaFromDiffuseTexture = true
    this.material.emissiveTexture = this.texture
    this.material.emissiveColor = new Color3(1, 1, 1)
    this.material.alpha = POPOVER_CONFIG.TEXTURE_ALPHA_3D ?? 0.6
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

    if (positioningMode === Popover3DPositioningMode.BILLBOARD) {
      this.mesh.billboardMode = 7 // BILLBOARDMODE_ALL
    } else if (
      positioningMode === Popover3DPositioningMode.DIEGETIC ||
      positioningMode === Popover3DPositioningMode.VERTICAL
    ) {
      this.mesh.billboardMode = 0
      this.rotateToFaceCamera(scene, this.mesh, position)
    }

    this.mesh.renderingGroupId = POPOVER_CONFIG.RENDERING_GROUP_ID_3D ?? 2

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

  private calculateTextureSize(text: string, fontSize: number): Popover3DTextureSize {
    const minWidth = 256
    const maxWidth = 1024
    const approximateWidth = Math.min(
      maxWidth,
      Math.max(minWidth, Math.floor(text.length * fontSize * 0.8)),
    )
    const height = fontSize * 3
    return {
      width: this.nextPowerOfTwo(approximateWidth),
      height: this.nextPowerOfTwo(height),
    }
  }

  private calculatePlaneSize(textureSize: Popover3DTextureSize): { width: number; height: number } {
    const baseHeight = (POPOVER_CONFIG.PLANE_BASE_HEIGHT_3D ?? 1) * 3
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

  private rotateToFaceCamera(scene: Scene, mesh: AbstractMesh, position: Vector3): void {
    const camera = scene.activeCamera
    if (!camera) return

    const direction = camera.position.subtract(position)
    const angleY = Math.atan2(direction.x, direction.z) + Math.PI
    mesh.rotation.y = angleY
  }
}
