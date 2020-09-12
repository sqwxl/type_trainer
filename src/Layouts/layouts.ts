// Physiological Types
enum Hand {
  LEFT,
  RIGHT,
  ANY
}
enum Finger {
  THUMB = "thumb",
  INDEX = "index",
  MIDDLE = "middle",
  RING = "ring",
  PINKY = "pinky",
}
type FingerHand = {
  hand: Hand
  finger: Finger
}

type KeyCode =
 "Escape"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12"
  | "Home"
  | "End"
  | "Insert"
  | "Delete"
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
  | "WakeUp"
  | "ControlLeft"
  | "AltLeft"
  | "Space"
  | "AltRight"
  | "ControlRight"
  | "PageUp"
  | "ArrowUp"
  | "PageDown"
  | "ArrowLeft"
  | "ArrowDown"
  | "ArrowRight"

type KeyboardPhysicalLayout = {
  [code: KeyCode]: { row: number; col: number }
}

export const StandardPhysicalLayout: KeyboardPhysicalLayout = {
  Escape: {
    row: 0,
    col: 0,
  },
  F1: {
    row: 0,
    col: 1,
  },
  F2: {
    row: 0,
    col: 2,
  },
  F3: {
    row: 0,
    col: 3,
  },
  F4: {
    row: 0,
    col: 4,
  },
  F5: {
    row: 0,
    col: 5,
  },
  F6: {
    row: 0,
    col: 6,
  },
  F7: {
    row: 0,
    col: 7,
  },
  F8: {
    row: 0,
    col: 8,
  },
  F9: {
    row: 0,
    col: 9,
  },
  F10: {
    row: 0,
    col: 10,
  },
  F11: {
    row: 0,
    col: 11,
  },
  F12: {
    row: 0,
    col: 12,
  },
  Home: {
    row: 0,
    col: 13,
  },
  End: {
    row: 0,
    col: 14,
  },
  Insert: {
    row: 0,
    col: 15,
  },
  Delete: {
    row: 0,
    col: 16,
  },
  Backquote: {
    row: 1,
    col: 0,
  },
  Digit1: {
    row: 1,
    col: 1,
  },
  Digit2: {
    row: 1,
    col: 2,
  },
  Digit3: {
    row: 1,
    col: 3,
  },
  Digit4: {
    row: 1,
    col: 4,
  },
  Digit5: {
    row: 1,
    col: 5,
  },
  Digit6: {
    row: 1,
    col: 6,
  },
  Digit7: {
    row: 1,
    col: 7,
  },
  Digit8: {
    row: 1,
    col: 8,
  },
  Digit9: {
    row: 1,
    col: 9,
  },
  Digit0: {
    row: 1,
    col: 10,
  },
  Minus: {
    row: 1,
    col: 11,
  },
  Equal: {
    row: 1,
    col: 12,
  },
  Backspace: {
    row: 1,
    col: 13,
  },
  Tab: {
    row: 2,
    col: 0,
  },
  KeyQ: {
    row: 2,
    col: 1,
  },
  KeyW: {
    row: 2,
    col: 2,
  },
  KeyE: {
    row: 2,
    col: 3,
  },
  KeyR: {
    row: 2,
    col: 4,
  },
  KeyT: {
    row: 2,
    col: 5,
  },
  KeyY: {
    row: 2,
    col: 6,
  },
  KeyU: {
    row: 2,
    col: 7,
  },
  KeyI: {
    row: 2,
    col: 8,
  },
  KeyO: {
    row: 2,
    col: 9,
  },
  KeyP: {
    row: 2,
    col: 10,
  },
  BracketLeft: {
    row: 2,
    col: 11,
  },
  BracketRight: {
    row: 2,
    col: 12,
  },
  Backslash: {
    row: 2,
    col: 13,
  },
  CapsLock: {
    row: 3,
    col: 0,
  },
  KeyA: {
    row: 3,
    col: 1,
  },
  KeyS: {
    row: 3,
    col: 2,
  },
  KeyD: {
    row: 3,
    col: 3,
  },
  KeyF: {
    row: 3,
    col: 4,
  },
  KeyG: {
    row: 3,
    col: 5,
  },
  KeyH: {
    row: 3,
    col: 6,
  },
  KeyJ: {
    row: 3,
    col: 7,
  },
  KeyK: {
    row: 3,
    col: 8,
  },
  KeyL: {
    row: 3,
    col: 9,
  },
  Semicolon: {
    row: 3,
    col: 10,
  },
  Quote: {
    row: 3,
    col: 11,
  },
  Enter: {
    row: 3,
    col: 12,
  },
  ShiftLeft: {
    row: 4,
    col: 0,
  },
  KeyZ: {
    row: 4,
    col: 1,
  },
  KeyX: {
    row: 4,
    col: 2,
  },
  KeyC: {
    row: 4,
    col: 3,
  },
  KeyV: {
    row: 4,
    col: 4,
  },
  KeyB: {
    row: 4,
    col: 5,
  },
  KeyN: {
    row: 4,
    col: 6,
  },
  KeyM: {
    row: 4,
    col: 7,
  },
  Comma: {
    row: 4,
    col: 8,
  },
  Period: {
    row: 4,
    col: 9,
  },
  Slash: {
    row: 4,
    col: 10,
  },
  ShiftRight: {
    row: 4,
    col: 11,
  },
  WakeUp: {
    row: 5,
    col: 0,
  },
  ControlLeft: {
    row: 5,
    col: 1,
  },
  AltLeft: {
    row: 5,
    col: 2,
  },
  Space: {
    row: 5,
    col: 3,
  },
  AltRight: {
    row: 5,
    col: 4,
  },
  ControlRight: {
    row: 5,
    col: 5,
  },
  PageUp: {
    row: 5,
    col: 6,
  },
  ArrowUp: {
    row: 5,
    col: 7,
  },
  PageDown: {
    row: 5,
    col: 8,
  },
  ArrowLeft: {
    row: 6,
    col: 0,
  },
  ArrowDown: {
    row: 6,
    col: 1,
  },
  ArrowRight: {
    row: 6,
    col: 1,
  },
}

export type KeyboardCharacterMap = { [code in KeyCode]: string }
export type KeyboardKeyLabels = { [code in KeyCode]: string | string[] }

export type KeyboardFingerMap = {
  [code in KeyCode]: FingerHand
}

export const StandardFingerMap: KeyboardFingerMap = {
  Escape: {hand: Hand.LEFT, finger: Finger.RING},
  F1: {hand: Hand.LEFT, finger: Finger.RING},
  F2: {hand: Hand.LEFT, finger: Finger.RING},
  F3: {hand: Hand.LEFT, finger: Finger.MIDDLE},
  F4: {hand: Hand.LEFT, finger: Finger.MIDDLE},
  F5: {hand: Hand.LEFT, finger: Finger.MIDDLE},
  F6: {hand: Hand.LEFT, finger: Finger.INDEX},
  F7: {hand: Hand.LEFT, finger: Finger.INDEX},
  F8: {hand: Hand.RIGHT, finger: Finger.INDEX},
  F9: {hand: Hand.RIGHT, finger: Finger.MIDDLE},
  F10:{hand: Hand.RIGHT, finger: Finger.MIDDLE},
  F11:{hand: Hand.RIGHT, finger: Finger.MIDDLE},
  F12:{hand: Hand.RIGHT, finger: Finger.RING},
  Home: {hand: Hand.RIGHT, finger: Finger.RING},
  End: {hand: Hand.RIGHT, finger: Finger.RING},
  Insert: {hand: Hand.RIGHT, finger: Finger.RING},
  Delete: {hand: Hand.RIGHT, finger: Finger.RING},
  Backquote: {hand: Hand.LEFT, finger: Finger.RING},
  Digit1: {hand: Hand.LEFT, finger: Finger.RING},
  Digit2: {hand: Hand.LEFT, finger: Finger.},
  Digit3: {hand: Hand.LEFT, finger: Finger.PINKY},
  Digit4: {hand: Hand.LEFT, finger: Finger.PINKY},
  Digit5: {hand: Hand.LEFT, finger: Finger.PINKY},
  Digit6: {hand: Hand.LEFT, finger: Finger.PINKY},
  Digit7: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Digit8: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Digit9: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Digit0: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Minus: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Equal: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Backspace: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Tab: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyQ: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyW: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyE: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyR: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyT: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyY: {hand: Hand.RIGHT, finger: Finger.PINKY},
  KeyU: {hand: Hand.RIGHT, finger: Finger.PINKY},
  KeyI: {hand: Hand.RIGHT, finger: Finger.PINKY},
  KeyO: {hand: Hand.RIGHT, finger: Finger.PINKY},
  KeyP: {hand: Hand.RIGHT, finger: Finger.PINKY},
  BracketLeft: {hand: Hand.RIGHT, finger: Finger.PINKY},
  BracketRight: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Backslash: {hand: Hand.RIGHT, finger: Finger.PINKY},
  CapsLock: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyA: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyS: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyD: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyF: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyG: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyH: {hand: Hand.RIGHT, finger: Finger.PINKY},
  KeyJ: {hand: Hand.RIGHT, finger: Finger.PINKY},
  KeyK: {hand: Hand.RIGHT, finger: Finger.PINKY},
  KeyL: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Semicolon: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Quote: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Enter: {hand: Hand.RIGHT, finger: Finger.PINKY},
  ShiftLeft: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyZ: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyX: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyC: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyV: {hand: Hand.LEFT, finger: Finger.PINKY},
  KeyB: {hand: Hand.ANY, finger: Finger.PINKY},
  KeyN: {hand: Hand.RIGHT, finger: Finger.PINKY},
  KeyM: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Comma: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Period: {hand: Hand.RIGHT, finger: Finger.PINKY},
  Slash: {hand: Hand.RIGHT, finger: Finger.PINKY},
  ShiftRight: {hand: Hand.RIGHT, finger: Finger.PINKY},
  WakeUp: {hand: Hand.LEFT, finger: Finger.PINKY},
  ControlLeft: {hand: Hand.LEFT, finger: Finger.PINKY},
  AltLeft: {hand: Hand.LEFT, finger: Finger.PINKY},
  Space: {hand: Hand.ANY, finger: Finger.PINKY},
  AltRight: {hand: Hand.RIGHT, finger: Finger.PINKY},
  ControlRight: {hand: Hand.RIGHT, finger: Finger.PINKY},
  PageUp: {hand: Hand.RIGHT, finger: Finger.PINKY},
  ArrowUp: {hand: Hand.RIGHT, finger: Finger.PINKY},
  PageDown: {hand: Hand.RIGHT, finger: Finger.PINKY},
  ArrowLeft: {hand: Hand.RIGHT, finger: Finger.PINKY},
  ArrowDown: {hand: Hand.RIGHT, finger: Finger.PINKY},
  ArrowRight: {hand: Hand.RIGHT, finger: Finger.PINKY},

}

export const characterSets: { [set: string]: Array<CharacterSet> } = {
  letters: [
    {
      kind: Kind.punctual,
      chars: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
      ],
      weight: 1,
    },
  ],
  punctuation: [
    {
      kind: Kind.punctual,
      chars: [",", ".", "?", "!", ";", ":", "'s"],
      weight: 5,
    },
    {
      kind: Kind.surrounding,
      chars: ["'", '"', "("],
      closing: ["'", '"', ")"],
      weight: 5,
    },
    {
      kind: Kind.splitting,
      chars: ["'", "-"],
      weight: 5,
    },
  ],
  symbols: [
    {
      kind: Kind.punctual,
      chars: ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "=", "+", "\\", "|", "<", ">", "/"],
      weight: 8,
    },
    {
      kind: Kind.surrounding,
      chars: ["'", '"', "(", "[", "{ ", "<"],
      closing: ["'", '"', ")", "]", " }", ">"],
      weight: 6,
    },
    {
      kind: Kind.splitting,
      chars: [".", "@", "_", "\\", "/"],
      weight: 5,
    },
  ],
  numbers: [
    {
      kind: Kind.punctual,
      chars: ["0", "1", "3", "4", "5", "6", "7", "9"],
      weight: 5,
    },
  ],
}
export enum Kind {
  "punctual",
  "splitting",
  "surrounding",
}
export interface CharacterSet {
  kind: Kind
  chars: Array<string>
  closing?: Array<string>
  weight: number
}
export const FingerZoneChars: { [finger: string]: Array<string> } = {
  thumb: [" "],
  index: ["6", "7", "r", "t", "y", "u", "f", "g", "h", "j", "c", "v", "b", "n", "m"],
}
