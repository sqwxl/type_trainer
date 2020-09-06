import { CharacterSet, Kind } from "../Components/Contexts/LayoutContext/layouts"
import MarkovChain from "./MarkovChain"

export function isVowel(char: string): boolean {
  const vowels = ["a", "e", "i", "o", "u"]
  return vowels.includes(char)
}

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



export function generateTrainingString(chain: MarkovChain, options: any, characterSets: { [set: string]: Array<CharacterSet>}) {
  // Return empty string if all characters options are false
  if (Object.values(options.characters).every(v => !v)) return ""
  let words: Array<string> = []

  const modifyingLikelyhood = 0.8
  let willApply = () => Math.random() * modifyingLikelyhood
  let minLength = 3
  let maxLength = 12

  while (words.length < options.wordsPerString) {
    let word = ""
    // generate a word that respects training set
    if (options.characters.letters) {
      if (options.trainingLevel > 2) {
      word = chain.generate(options.markov, characterSets.letters[0].chars)
      } else {
        while (word.length < minLength + Math.floor(Math.random() * (maxLength - minLength))) {
          let char = characterSets.letters[0].chars[Math.floor(Math.random() * characterSets.letters[0].chars.length)]
          word += char
        }
      }
    } else {
      word = ""
    }
    if (options.characters.caps && willApply()) word = word.slice(0, 1).toUpperCase().concat(word.slice(1))
    if (options.characters.punct && willApply()) word = symbolize(word, characterSets.punctuation)
    if (options.characters.syms && willApply()) word = symbolize(word, characterSets.symbols)
    if (options.characters.nums && willApply()) word = symbolize(word, characterSets.numbers)
    words.push(word)
  }

  return words.join(options.characters.spaces ? " " : "")

  function symbolize(str: string, symbols: Array<CharacterSet>): string {
    // Relative likelihoods of different types of punctuation
    const weights = symbols.reduce((a, c) => a.concat([c.weight]), [] as number[])
    let loto = Math.round(Math.random() * weights.reduce((a, c) => c + a))
    let type = 0
    let sum = 0
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i]
      if (loto <= sum) {
        type = i
        break
      }
    }
    let symbolized = str
    let { kind, chars } = symbols[type]
    let idx = Math.floor(Math.random() * chars.length)
    switch (kind) {
      case Kind.punctual: // punctuating
        symbolized = str.concat(chars[idx])
        break
      case Kind.surrounding: // surounding
        symbolized = chars[idx].concat(str, symbols[type].closing![idx])
        break
      case Kind.splitting: // splitting
        if (str.length < 5) break
        let split = 0
        // Try to split somewhere after 2nd and before 2nd-to-last letters -- not between two vowels
        for (let i = 2; i < str.length - 3; i++) {
          if (!isVowel(str[i]) && !isVowel(str[i + 1])) {
            split = i
            break
          }
        }
        if (split === 0) break
        symbolized = str.slice(0, split).concat(chars[idx], str.slice(split))
        break
      default:
        break
    }
    return symbolized
  }
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


