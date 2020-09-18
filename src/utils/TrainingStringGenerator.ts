import { SessionOptions } from "../Components/TypeTrainer"
import { en_US_CharSet } from "../Layouts/en_US"
import MarkovChain from "./MarkovChain"
import { getCharactersPerFinger } from "./training"
import { applyMaskToCharSet } from "./utils"
import { StandardFingerMap } from "../Layouts/StandardPhysicalLayout"
import { TrainingLevel } from "./models"
import { CharacterSet, CharacterType, Finger } from "../Layouts/layouts"

export interface TrainingStringGenerator {
  generate(options: SessionOptions): string
}

export class MarkovTrainingStringGenerator implements TrainingStringGenerator {
  private chain: MarkovChain
  constructor(dictionary: string[]) {
    this.chain = new MarkovChain(3, dictionary)
  }

  generate(options: SessionOptions, fullCharSet = en_US_CharSet): string {
    // BASED ON OPTIONS, GENERATE STRING

    // Return empty string if all characters options are false
    if (Object.values(options.characters).every(v => !v)) return ""

    // get character set based on training level ( intersection of traininglevel, fingermap, and charset)
    const trainingLevel = TrainingLevel[options.trainingLevel]
    const charSet = getCharSetAtTrainingLevel(fullCharSet, trainingLevel)

    let words: Array<string> = []

    const modifyingLikelyhood = 0.8
    let modificationShouldApply = () => Math.random() < modifyingLikelyhood
    let minLength = 3
    let maxLength = 12

    while (words.length < options.wordsPerString) {
      let word = ""
      // generate a word that respects training set
      if (options.characters.letters) {
        const letters = charSet
          .filter(char => char.type === CharacterType.LOWERCASE_LETTER)
          .map(char => char.glyph as string)
        if (options.trainingLevel > 2) {
          // todo: make generation work the same at all levels
          word = this.chain.generate(options.markov, letters)
        } else {
          let wordLength = minLength + Math.floor(Math.random() * (maxLength - minLength))
          while (word.length < wordLength) {
            let char = letters[Math.floor(Math.random() * letters.length)]
            word += char
          }
        }
      } else {
        word = ""
      }
      // APPLY MODS
      if (options.characters.caps && modificationShouldApply())
        word = word.slice(0, 1).toUpperCase().concat(word.slice(1))
      if (options.characters.punct && modificationShouldApply())
        word = symbolize(
          word,
          charSet.filter(char => char.type === CharacterType.PUNCTUATION)
        )
      if (options.characters.syms && modificationShouldApply()) word = symbolize(word, charSet.filter(char => char.type === CharacterType.SYMBOL))
      if (options.characters.nums && modificationShouldApply()) word = symbolize(word, charSet.filter(char => char.type === CharacterType.NUMBER))
      words.push(word)
    }

    return words.join(options.characters.spaces ? " " : "")

    function symbolize(str: string, charSet: CharacterSet): string {
      let symbolized = str
      let { kind, chars } = charSet[type]
      let idx = Math.floor(Math.random() * chars.length)
      switch (kind) {
        case Kind.punctual: // punctuating
          symbolized = str.concat(chars[idx])
          break
        case Kind.surrounding: // surounding
          symbolized = chars[idx].concat(str, charSet[type].closing![idx])
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
}

export class MockTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private trainingString: string) {}
  generate(options: SessionOptions) {
    return this.trainingString
  }
}

function getCharSetAtTrainingLevel(fullCharSet: CharacterSet, trainingLevel: Finger[]): CharacterSet {
  let filteredSet: CharacterSet = [...fullCharSet]
  fullCharSet.filter(charObject => {
    if (charObject.code instanceof Array) {
      const eachCharIsIncluded = charObject.code.every(code => trainingLevel.includes(StandardFingerMap[code].finger))
      if (eachCharIsIncluded) return true
    } else if (!trainingLevel.includes(StandardFingerMap[charObject.code].finger)) {
      return true
    }
    return false
  })
  return filteredSet
}

export function newTrainingStringGenerator() {
  return new MarkovTrainingStringGenerator(chain)
}
