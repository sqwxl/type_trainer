import { GuidedModeStringOptions, PracticeModeStringOptions, StringOptions } from "../../Components/TypeTrainer"
import MarkovChain from "./MarkovChain"

export interface TrainingStringGenerator {
  generate(options: StringOptions, alphabet?: string[]): string[] | string
}

export class MockTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private trainingString: string) {}
  generate(): string[] {
    return this.trainingString.split(' ')
  }
}

export class GuidedModeStringGenerator implements TrainingStringGenerator {
  constructor(private dictionary: string[]) {}

  generate(options: GuidedModeStringOptions, alphabet: string[]): string[] {
    const nullSumOptions = !options.letters && Object.values(options.wordModifierOptions).every(v => !v)
    // Return empty string if all characters options are false
    if (nullSumOptions) return [""]
    // get markovchain based on restricted dictionary (based on fullcharset/traininglevel)
    const chain = this.newMarkovChainRestrictedToLetters(alphabet)

    
    const words: Array<string> = []
    while (words.length < options.wordsPerString) {
      let word = ''
      try {
        word = chain.generate(options.wordLength)
      } catch (error) {
        console.error(error.message)
        const { minLength, maxLength } = options.wordLength
        const length = minLength + Math.floor(Math.random() * (maxLength - minLength))
        for (let i = 0; i < length; i++ ) {
          const letter = alphabet[Math.floor(Math.random() * alphabet.length)]
          word = word.concat(letter)
        }
      }
      words.push(word)
    }

    return words
  }

  private newMarkovChainRestrictedToLetters(allowedLetters: string[]): MarkovChain {
    const dict = this.dictionary.filter(word => {
      for (const letter of word) {
        if (!allowedLetters.includes(letter)) return false
      }
      return true
    })
    return new MarkovChain(3, dict)
  }

}

export class PracticeModeStringGenerator implements TrainingStringGenerator {
  constructor(private source: string, private textCursor: number = 0) {}
  generate(options: PracticeModeStringOptions) {
    let str: string
    if (options.fullSentences) {
      str = this.nextFullSentence(options.source)
    } else {
      str = this.advanceCursorByWords(options)
    }
    return str
  }
  nextFullSentence(source: string): string {
    let start = this.textCursor
    let end = this.advanceCursorByOne(start)
    while (/\s/.test(source[start])) {
      start = this.advanceCursorByOne(start)
      end = this.advanceCursorByOne(start)
      if (end < start) {
        start = end
        end = this.advanceCursorByOne(start)
      }
    }
    while(source[end] !== '.') {
      end = this.advanceCursorByOne(end)
    }
    this.textCursor = this.advanceCursorByOne(end)
    return source.slice(start, end)
  }
  advanceCursorByOne(pos?: number): number {
    return pos != null ? (pos + 1) % this.source.length : (this.textCursor + 1) % this.source.length
  }
  advanceCursorByWords({ source, wordsPerString }: PracticeModeStringOptions): string {
    let count = 0
    let words: string[] = []
    let start = this.textCursor
    let end = this.advanceCursorByOne(start)
    let getNextWord = (): string => {
      while(/\s/.test(source[start])) {
        start = this.advanceCursorByOne(start)
        end = this.advanceCursorByOne(start)
        if (end < start) {
          start = end
          end = this.advanceCursorByOne(start)
        }
      }
      while(!/\s/.test(source[end])) {
        end = this.advanceCursorByOne(end)
        if (end < start) throw new RangeError("Can't generate next word; perhaps the source string is too short?")
      }
      return this.source.slice(start, end)
    }

    while (count <= wordsPerString) {
      words.push(getNextWord())
      count++
    }
    return words.join(' ')
  }

}
/* 
export class GuidedCourseTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private charSet: CharacterSet) {}
  generate(options:SessionOptions) {
    let str = ""
    return str
  }
} */


