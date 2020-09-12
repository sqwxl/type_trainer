import { SessionOptions } from "../Components/TypeTrainer"
import MarkovChain from "./MarkovChain"
import dict from "../english_words_array.json"
import { getCharactersPerFinger } from "./training"
import { applyMaskToCharSet } from "./utils"
import { allCharacterSets } from "../Layouts/layouts";

export interface TrainingStringGenerator {
  generate(options: SessionOptions): string
}

const chain = new MarkovChain(3, dict.dict)

export class MarkovTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private chain: MarkovChain) {}

  generate(options: SessionOptions): string {
    // BASED ON OPTIONS, GENERATE STRING

    let charactersPerFinger = getCharactersPerFinger(options.trainingLevel)
    const characterSets = applyMaskToCharSet(allCharacterSets, charactersPerFinger)

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
}

export class MockTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private trainingString: string) {}
  generate(options: SessionOptions) {
    return this.trainingString
  }
}

export function newTrainingStringGenerator() {
  return new MarkovTrainingStringGenerator(chain)
}
