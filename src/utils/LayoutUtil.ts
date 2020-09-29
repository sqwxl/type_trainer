import * as PhysicalKB from "./PhysicalKeyboard"
import { CourseLevel } from "./Courses"

// Standard KeyboardEvent codes
export type KeyCode =
  | "NONE"
  | "Backquote"
  | "Digit1"
  | "Digit2"
  | "Digit3"
  | "Digit4"
  | "Digit5"
  | "Digit6"
  | "Digit7"
  | "Digit8"
  | "Digit9"
  | "Digit0"
  | "Minus"
  | "Equal"
  | "Backspace"
  | "Tab"
  | "KeyQ"
  | "KeyW"
  | "KeyE"
  | "KeyR"
  | "KeyT"
  | "KeyY"
  | "KeyU"
  | "KeyI"
  | "KeyO"
  | "KeyP"
  | "BracketLeft"
  | "BracketRight"
  | "Backslash"
  | "CapsLock"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "KeyF"
  | "KeyG"
  | "KeyH"
  | "KeyJ"
  | "KeyK"
  | "KeyL"
  | "Semicolon"
  | "Quote"
  | "Enter"
  | "ShiftLeft"
  | "KeyZ"
  | "KeyX"
  | "KeyC"
  | "KeyV"
  | "KeyB"
  | "KeyN"
  | "KeyM"
  | "Comma"
  | "Period"
  | "Slash"
  | "ShiftRight"
  | "ControlLeft"
  | "AltLeft"
  | "Space"
  | "AltRight"
  | "ControlRight"


//
// Virtual Keyboard
//

export type KeyLabel = { main: string; shift?: string; opt?: string }
export type KeyLabels = { [code in KeyCode]: KeyLabel }

export enum CharacterType {
  LOWERCASE_LETTER,
  NUMBER,
  PUNCTUATION,
  SYMBOL,
  PROGRAMMING,
}
export enum CharacterBehavior {
  SEQUENTIAL,
  PREPEND,
  APPEND,
  PREPEND_OR_APPEND,
  SPLIT,
  BRACKET,
  OPERATOR,
}

type Character = string

export type CharacterSet = Array<{
  code: KeyCode[]
  glyph: Character
  bracketPair?: Character
  type: CharacterType
  behavior: CharacterBehavior
}>


export interface Layout {
  charSet: CharacterSet
  labels: KeyLabels
  vowels: string[]
}

export type VisualKeyboard = {
  code: KeyCode
  labels: KeyLabel
  fingerHand: { hand: PhysicalKB.Hand; finger: PhysicalKB.Finger }
}[][]


export class VisualKB {
  private _keyboard: VisualKeyboard
  constructor(labels: KeyLabels) {
    const physicalLayout = PhysicalKB.Layout
    const fingerMap = PhysicalKB.FingerMap
    const keyboard: VisualKeyboard = []
    for (const [idx, rowCodes] of physicalLayout.entries()) {
      keyboard[idx] = []
      for (const [col, code] of rowCodes.entries()) {
        keyboard[idx][col] = {
          code: code as KeyCode,
          labels: labels[code as KeyCode],
          fingerHand: fingerMap[code as KeyCode],
        }
      }
    }
    this._keyboard = keyboard
  }
  get keyboard(): VisualKeyboard {
    return this._keyboard
  }
}

export class CharSet {
  private _charSet: CharacterSet
  private _vowels: string[]
  constructor(layout: Layout) {
    this._charSet = layout.charSet
    this._vowels = layout.vowels
  }
  get charSet(): CharacterSet {
    return this._charSet
  }
  get vowels(): string[] {
    return this._vowels
  }

  static uniqueChars(charSet: CharacterSet): string[] {
    return charSet.reduce((chars: string[], { glyph, bracketPair }) => {
      if (chars.includes(glyph)) return chars
      chars = chars.concat(glyph)
      if (bracketPair == null || chars.includes(bracketPair)) return chars
      return chars.concat(bracketPair)
    }, [])
  }

  static uniqueKeyCodes(charSet: CharacterSet): KeyCode[] {
    return charSet.reduce((arr: KeyCode[], charObj) => {
      for (const code of charObj.code) {
        if (!arr.includes(code)) {
          arr = arr.concat(code)
        }
      }
      return arr
    }, [])
  }

  keyCodeFromChar(char: string): KeyCode {
    const charObj = this._charSet.find(charObj => charObj.code.length === 1 && charObj.glyph === char)
    if (charObj != null) return charObj.code[0]
    return "NONE"
  }

  subSet(options?: { trainingLevel?: CourseLevel; type?: CharacterType }): CharacterSet {
    let subSet = this._charSet
    if (!options) return subSet
    if (options.trainingLevel != null) {
      subSet = this.charSetAtCourseLevel(options.trainingLevel)
    }
    if (options.type != null) {
      subSet = subSet.filter(char => char.type === options.type)
    }
    return subSet
  }

charSetAtCourseLevel(courseLevel: CourseLevel): CharacterSet {
    let filteredSet: CharacterSet = [...this._charSet]

    const specifiesRows = courseLevel.keyBoardRows != null
    const specifiesHand = courseLevel.hand != null
    const specifiesFingers = courseLevel.fingers != null && courseLevel.fingers.length > 0

    if (!specifiesRows && !specifiesHand && !specifiesFingers) return filteredSet

    filteredSet = this._charSet.filter(charObject => {
      let rowCodes: KeyCode[] = []
      if (specifiesRows) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const row of courseLevel.keyBoardRows!) {
          rowCodes = rowCodes.concat(PhysicalKB.Layout[row])
        }
      }
      for (const charCode of charObject.code) {
        if (specifiesRows) {
          const codeIntersectsRows = rowCodes.includes(charCode)
          // filter out rows
          if (!codeIntersectsRows) return false
        }
        if (specifiesHand) {
          // filter out hand
          const codeIntersectsHand =
            courseLevel.hand === PhysicalKB.Hand.ANY || courseLevel.hand === PhysicalKB.FingerMap[charCode].hand
          if (!codeIntersectsHand) return false
        }
        // filter out finger
        if (specifiesFingers) {
          const codeIntersectsFinger =
            courseLevel.fingers?.[0] === PhysicalKB.Finger.ANY ||
            courseLevel.fingers?.includes(PhysicalKB.FingerMap[charCode].finger)
          if (!codeIntersectsFinger) return false
        }
      }
      return true
    })

    return filteredSet //new LayoutUtil(filteredSet, this._keyLabels, this._vowels)
  }
}

export default class LayoutUtil implements LayoutUtil {
  private _charSet: CharSet
  private _visualKB: VisualKB
  constructor(layout: Layout) {
    this._charSet = new CharSet(layout)
    this._visualKB = new VisualKB(layout.labels)
  }
  
  get charSet(): CharSet {
    return this._charSet
  }
  get visualKB(): VisualKB {
    return this._visualKB
  }
}
