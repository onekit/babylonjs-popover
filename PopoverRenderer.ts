import * as GUI from 'babylonjs-gui'
import { POPOVER_CONFIG } from './PopoverConfig'

export type OnPanelCreatedCallback = (panelName: string) => void

/**
 * PopoverRenderer - creates 2D fullscreen UI popover (screen-space).
 * Optional onPanelCreated callback for host apps that manage UI layer order.
 */
export class PopoverRenderer {
  private text: GUI.TextBlock | undefined
  private panel: GUI.StackPanel | undefined
  private advancedTexture: GUI.AdvancedDynamicTexture | undefined
  private onPanelCreated: OnPanelCreatedCallback | undefined

  setOnPanelCreated(callback: OnPanelCreatedCallback | undefined): void {
    this.onPanelCreated = callback
  }

  create(
    fontFamily: string,
    fontSize: number,
    color: string,
    outlineColor: string,
    outlineWidth: number,
  ): GUI.TextBlock {
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('Popover')
    this.onPanelCreated?.('Popover')

    this.text = new GUI.TextBlock('popoverText')
    this.panel = new GUI.StackPanel('popoverPanel')
    this.panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    this.panel.paddingBottom = POPOVER_CONFIG.PADDING_BOTTOM

    this.text.fontFamily = fontFamily
    this.text.fontWeight = 'bold'
    this.text.outlineColor = outlineColor
    this.text.outlineWidth = outlineWidth
    this.text.color = color
    this.text.fontSize = fontSize
    this.text.textWrapping = true
    this.text.resizeToFit = true
    this.text.text = ''
    this.text.alpha = 1
    this.text.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM

    this.panel.addControl(this.text)
    this.advancedTexture.addControl(this.panel)

    return this.text
  }

  dispose(): void {
    if (this.advancedTexture && this.panel && this.text) {
      this.text.dispose()
      this.panel.dispose()
      this.advancedTexture.dispose()
    }
    this.text = undefined
    this.panel = undefined
    this.advancedTexture = undefined
  }

  getText(): GUI.TextBlock | undefined {
    return this.text
  }
}
