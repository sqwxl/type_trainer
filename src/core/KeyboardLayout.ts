import { KeyboardFingerMap, KeyCapLabelMap, PhysicalLayout, VisualKeyboard } from "./Keyboard"
import { KeyCode } from "./KeyCode"


export class KeyboardLayout {
  private _keyboard: VisualKeyboard
  constructor(private _labelMap: KeyCapLabelMap) {
    const physicalLayout = PhysicalLayout
    const fingerMap = KeyboardFingerMap
    const keyboard: VisualKeyboard = []
    for (const [idx, rowCodes] of physicalLayout.entries()) {
      keyboard[idx] = []
      for (const [col, code] of rowCodes.entries()) {
        keyboard[idx][col] = {
          code: code as KeyCode,
          label: _labelMap[code as KeyCode],
          fingerHand: fingerMap[code as KeyCode],
        }
      }
    }
    this._keyboard = keyboard
  }
  get keyboard(): VisualKeyboard {
    return this._keyboard
  }
  get labelMap(): KeyCapLabelMap {
    return this._labelMap
  }
}

