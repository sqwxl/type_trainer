export enum Finger {
  pinkyL = "pinky",
  ringL = "ring",
  middleL = "middle",
  indexL = "index",
  indexR = "index",
  middleR = "middle",
  ringR = "ring",
  pinkyR = "pinky",
  thumb = "thumb",
}

export enum FingerZone {
  t = "thumb",
  i = "index",
  m = "middle",
  r = "ring",
  p = "pinky",
}

export const FingerZoneChars: { [finger: string]: Array<string>  } = {
  thumb: [" "],
  index:  ["6", "7", "r", "t", "y", "u", "f", "g", "h", "j", "c", "v", "b", "n", "m"]
}



interface KeyBtnData {
  code: string
  key: string
  label?: string
  finger?: Finger
}

export const layouts: { [name: string]: KeyBtnData[][] } = {
  enUS_linux: [
    [
      { code: "Escape", key: "Escape", label: "Esc" },
      { code: "F1", key: "F1" },
      { code: "F2", key: "F2" },
      { code: "F3", key: "F3" },
      { code: "F4", key: "F4" },
      { code: "F5", key: "F5" },
      { code: "F6", key: "F6" },
      { code: "F7", key: "F7" },
      { code: "F8", key: "F8" },
      { code: "F9", key: "F9" },
      { code: "F10", key: "F10" },
      { code: "F11", key: "F11" },
      { code: "F12", key: "F12" },
      { code: "Home", key: "Home" },
      { code: "End", key: "End" },
      { code: "Insert", key: "Insert" },
      { code: "Delete", key: "Delete" },
    ],
    [
      { code: "Backquote", key: "` ~", label: "~<br>`", finger: Finger.pinkyL },
      { code: "Digit1", key: "1 !", label: "!<br>1", finger: Finger.pinkyL },
      { code: "Digit2", key: "2 @", label: "@<br>2", finger: Finger.ringL },
      { code: "Digit3", key: "3 #", label: "#<br>3", finger: Finger.middleL },
      { code: "Digit4", key: "4 $", label: "$<br>4", finger: Finger.middleL },
      { code: "Digit5", key: "5 %", label: "%<br>5", finger: Finger.middleL },
      { code: "Digit6", key: "6 ^", label: "^<br>6", finger: Finger.indexL },
      { code: "Digit7", key: "7 &", label: "&<br>7", finger: Finger.indexR },
      { code: "Digit8", key: "8 *", label: "*<br>8", finger: Finger.middleR },
      { code: "Digit9", key: "9 (", label: "(<br>9", finger: Finger.middleR },
      { code: "Digit0", key: "0 )", label: ")<br>0", finger: Finger.ringR },
      { code: "Minus", key: "- =", label: "_<br>-", finger: Finger.ringR },
      { code: "Equal", key: "= +", label: "+<br>=", finger: Finger.pinkyR },
      { code: "Backspace", key: "Backspace", finger: Finger.pinkyR },
    ],
    [
      { code: "Tab", key: "Tab", finger: Finger.pinkyL },
      { code: "KeyQ", key: "Q", finger: Finger.pinkyL },
      { code: "KeyW", key: "W", finger: Finger.ringL },
      { code: "KeyE", key: "E", finger: Finger.middleL },
      { code: "KeyR", key: "R", finger: Finger.indexL },
      { code: "KeyT", key: "T", finger: Finger.indexL },
      { code: "KeyY", key: "Y", finger: Finger.indexR },
      { code: "KeyU", key: "U", finger: Finger.indexR },
      { code: "KeyI", key: "I", finger: Finger.middleR },
      { code: "KeyO", key: "O", finger: Finger.ringR },
      { code: "KeyP", key: "P", finger: Finger.pinkyR },
      { code: "BracketLeft", key: "[ {", label: "{<br>[", finger: Finger.pinkyR },
      { code: "BracketRight", key: "] }", label: "{<br>]", finger: Finger.pinkyR },
      { code: "Backslash", key: "\\ |", label: "|<br>\\", finger: Finger.pinkyR },
    ],
    [
      { code: "CapsLock", key: "CapsLock", finger: Finger.pinkyL },
      { code: "KeyA", key: "A", finger: Finger.pinkyL },
      { code: "KeyS", key: "S", finger: Finger.ringL },
      { code: "KeyD", key: "D", finger: Finger.middleL },
      { code: "KeyF", key: "F", finger: Finger.indexL },
      { code: "KeyG", key: "G", finger: Finger.indexL },
      { code: "KeyH", key: "H", finger: Finger.indexR },
      { code: "KeyJ", key: "J", finger: Finger.indexR },
      { code: "KeyK", key: "K", finger: Finger.middleR },
      { code: "KeyL", key: "L", finger: Finger.ringR },
      { code: "Semicolon", key: "; :", label: ":<br>;", finger: Finger.pinkyR },
      { code: "Quote", key: `' "`, label: "\"<br>'", finger: Finger.pinkyR },
      { code: "Enter", key: "Enter", finger: Finger.pinkyR },
    ],
    [
      { code: "ShiftLeft", key: "Shift", finger: Finger.pinkyL },
      { code: "KeyZ", key: "Z", finger: Finger.ringL },
      { code: "KeyX", key: "X", finger: Finger.middleL },
      { code: "KeyC", key: "C", finger: Finger.indexL },
      { code: "KeyV", key: "V", finger: Finger.indexL },
      { code: "KeyB", key: "B", finger: Finger.indexR },
      { code: "KeyN", key: "N", finger: Finger.indexR },
      { code: "KeyM", key: "M", finger: Finger.indexR },
      { code: "Comma", key: ", <", label: "<<br>,", finger: Finger.middleR },
      { code: "Period", key: ". >", label: "><br>.", finger: Finger.ringR },
      { code: "Slash", key: "/ ?", label: "?<br>/", finger: Finger.pinkyR },
      { code: "ShiftRight", key: "Shift", finger: Finger.pinkyR },
    ],
    [
      { code: "WakeUp", key: "WakeUp", label: "Fn" },
      { code: "ControlLeft", key: "Control", label: "Ctrl" },
      { code: "AltLeft", key: "Alt" },
      { code: "Space", key: " ", finger: Finger.thumb },
      { code: "AltRight", key: "AltGraph", label: "Alt" },
      { code: "ControlRight", key: "Control", label: "Ctrl" },
      { code: "PageUp", key: "PageUp", label: "PgUp" },
      { code: "ArrowUp", key: "ArrowUp", label: "⬆" },
      { code: "PageDown", key: "PageDown", label: "PgDn" },
    ],
    [
      { code: "ArrowLeft", key: "ArrowLeft", label: "⬅" },
      { code: "ArrowDown", key: "ArrowDown", label: "⬇" },
      { code: "ArrowRight", key: "ArrowRight", label: "➡" },
    ],
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
