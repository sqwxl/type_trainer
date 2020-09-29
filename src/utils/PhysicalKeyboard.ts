import { KeyCode } from "./LayoutUtil"


export type KeyboardPhysicalLayout = KeyCode[][]

export const Layout: KeyboardPhysicalLayout = [
  ['Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace'],
  ['Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash'],
  ['CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter'],
  ['ShiftLeft','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','ShiftRight'],
  ['ControlLeft','AltLeft','Space','AltRight','ControlRight']
]


//
// Physiological Types
//
export enum Hand {
  LEFT,
  RIGHT,
  ANY,
}
export enum Finger {
  ANY = "any",
  THUMB = "thumb",
  INDEX = "index",
  MIDDLE = "middle",
  RING = "ring",
  PINKY = "pinky",
}

export type KeyboardFingerMap = {
  [code in KeyCode]: { hand: Hand, finger: Finger }
}


export const FingerMap: KeyboardFingerMap = {
  NONE: { hand: Hand.ANY, finger: Finger.ANY },
  Backquote: { hand: Hand.LEFT, finger: Finger.PINKY },
  Digit1: { hand: Hand.LEFT, finger: Finger.PINKY },
  Digit2: { hand: Hand.LEFT, finger: Finger.RING },
  Digit3: { hand: Hand.LEFT, finger: Finger.MIDDLE },
  Digit4: { hand: Hand.LEFT, finger: Finger.INDEX },
  Digit5: { hand: Hand.LEFT, finger: Finger.INDEX },
  Digit6: { hand: Hand.LEFT, finger: Finger.INDEX },
  Digit7: { hand: Hand.RIGHT, finger: Finger.INDEX },
  Digit8: { hand: Hand.RIGHT, finger: Finger.MIDDLE },
  Digit9: { hand: Hand.RIGHT, finger: Finger.RING },
  Digit0: { hand: Hand.RIGHT, finger: Finger.PINKY },
  Minus: { hand: Hand.RIGHT, finger: Finger.PINKY },
  Equal: { hand: Hand.RIGHT, finger: Finger.PINKY },
  Backspace: { hand: Hand.RIGHT, finger: Finger.PINKY },
  Tab: { hand: Hand.LEFT, finger: Finger.PINKY },
  KeyQ: { hand: Hand.LEFT, finger: Finger.PINKY },
  KeyW: { hand: Hand.LEFT, finger: Finger.RING },
  KeyE: { hand: Hand.LEFT, finger: Finger.MIDDLE },
  KeyR: { hand: Hand.LEFT, finger: Finger.INDEX },
  KeyT: { hand: Hand.LEFT, finger: Finger.INDEX },
  KeyY: { hand: Hand.RIGHT, finger: Finger.INDEX },
  KeyU: { hand: Hand.RIGHT, finger: Finger.INDEX },
  KeyI: { hand: Hand.RIGHT, finger: Finger.MIDDLE },
  KeyO: { hand: Hand.RIGHT, finger: Finger.RING },
  KeyP: { hand: Hand.RIGHT, finger: Finger.PINKY },
  BracketLeft: { hand: Hand.RIGHT, finger: Finger.PINKY },
  BracketRight: { hand: Hand.RIGHT, finger: Finger.PINKY },
  Backslash: { hand: Hand.RIGHT, finger: Finger.PINKY },
  CapsLock: { hand: Hand.LEFT, finger: Finger.PINKY },
  KeyA: { hand: Hand.LEFT, finger: Finger.PINKY },
  KeyS: { hand: Hand.LEFT, finger: Finger.RING },
  KeyD: { hand: Hand.LEFT, finger: Finger.MIDDLE },
  KeyF: { hand: Hand.LEFT, finger: Finger.INDEX },
  KeyG: { hand: Hand.LEFT, finger: Finger.INDEX },
  KeyH: { hand: Hand.RIGHT, finger: Finger.INDEX },
  KeyJ: { hand: Hand.RIGHT, finger: Finger.INDEX },
  KeyK: { hand: Hand.RIGHT, finger: Finger.MIDDLE },
  KeyL: { hand: Hand.RIGHT, finger: Finger.RING },
  Semicolon: { hand: Hand.RIGHT, finger: Finger.PINKY },
  Quote: { hand: Hand.RIGHT, finger: Finger.PINKY },
  Enter: { hand: Hand.RIGHT, finger: Finger.PINKY },
  ShiftLeft: { hand: Hand.LEFT, finger: Finger.PINKY },
  KeyZ: { hand: Hand.LEFT, finger: Finger.PINKY },
  KeyX: { hand: Hand.LEFT, finger: Finger.RING },
  KeyC: { hand: Hand.LEFT, finger: Finger.MIDDLE },
  KeyV: { hand: Hand.LEFT, finger: Finger.INDEX },
  KeyB: { hand: Hand.ANY, finger: Finger.INDEX },
  KeyN: { hand: Hand.RIGHT, finger: Finger.INDEX },
  KeyM: { hand: Hand.RIGHT, finger: Finger.INDEX },
  Comma: { hand: Hand.RIGHT, finger: Finger.MIDDLE },
  Period: { hand: Hand.RIGHT, finger: Finger.RING },
  Slash: { hand: Hand.RIGHT, finger: Finger.PINKY },
  ShiftRight: { hand: Hand.RIGHT, finger: Finger.PINKY },
  ControlLeft: { hand: Hand.LEFT, finger: Finger.PINKY },
  AltLeft: { hand: Hand.LEFT, finger: Finger.MIDDLE },
  Space: { hand: Hand.ANY, finger: Finger.THUMB },
  AltRight: { hand: Hand.RIGHT, finger: Finger.INDEX },
  ControlRight: { hand: Hand.RIGHT, finger: Finger.RING }
}
