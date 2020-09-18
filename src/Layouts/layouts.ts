//
// Standard KeyboardEvent codes ( event.code )
//
export type KeyCode =
  | "NONE"
  | "Escape"
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
export type FingerHand = {
  hand: Hand
  finger: Finger
}
export type KeyboardFingerMap = {
  [code in KeyCode]: FingerHand
}

//
// Virtual Keyboard
//
export type KeyboardPhysicalLayout = {
  [row: string]: KeyCode[]
}

export type KeyLabel = { main: string; shift?: string; opt?: string }
export type KeyboardKeyLabels = { [code in KeyCode]: KeyLabel }

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
type BracketCharPair = [open: Character, close: Character]

export type CharacterSet = Array<{
  code: KeyCode | KeyCode[]
  glyph: Character | BracketCharPair
  type: CharacterType
  behavior: CharacterBehavior
}>
