import { CharacterSet, characterSets as allCharacterSets, Kind } from "./kb_types"
import MarkovChain from "./TrainingStringGenerator/MarkovChain"
import {SessionOptions} from '../Components/TypeTrainer'



export function isChar(code: string) {
  if (code.slice(0, 3) === "Key") return true
  if (code.slice(0, 5) === "Digit") return true
  switch (code) {
    case "Space":
    case "Backquote":
    case "Minus":
    case "Equal":
    case "BracketLeft":
    case "BracketRight":
    case "Backslash":
    case "Semicolon":
    case "Quote":
    case "Comma":
    case "Period":
    case "Slash":
      return true
    default:
      return false
  }
}



export function applyMaskToCharSet(characterSets: { [set: string]: Array<CharacterSet> }, characterMask?: Array<string>) {
  if (characterMask == null || characterMask.length === 0) return characterSets
  const charSetsCopy = {...characterSets}
  Object.keys(charSetsCopy).forEach(set => {
    charSetsCopy[set] = charSetsCopy[set].map(kind => {
      let masked = {...kind}
      if (masked.kind === Kind.surrounding) {
        for (let idx = 0; idx < kind.chars.length; idx++) {
          if (!characterMask.includes(kind.chars[idx]) || !characterMask.includes(kind.closing![idx])) {
            masked.chars = kind.chars.slice(0, idx).concat(kind.chars.slice(idx + 1))
            masked.closing = kind.closing!.slice(0, idx).concat(kind.closing!.slice(idx + 1))
          }
        }
      } else {
        masked.chars = masked.chars.filter(ch => characterMask.includes(ch))
      }
      return masked
    })
  })
  return charSetsCopy
}

export function Timer() {
  let paused: boolean
  let startMark: number
  let pauseMark: number
  let pausedLength: number
  return {
    start: () => {
      startMark = Date.now()
      paused = false
      pauseMark = 0
      pausedLength = 0
    },
    pause: () => {
      if (!paused) {
        paused = true
        pauseMark = Date.now()
      }
    },
    unPause: () => {
      if (paused) {
        paused = false
        pausedLength += Date.now() - pauseMark
      }
    },
    getTimeElapsed: () => {
      let total = Date.now() - (startMark + pausedLength)
      return total
    },
  }
}


