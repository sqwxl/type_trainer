import { TrainingStringOptions } from "../../Components/TypeTrainer"
import MarkovChain from "./MarkovChain"

export interface TrainingStringGenerator {
  generate(options: TrainingStringOptions, alphabet?: string[]): string[]
}

export class MockTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private trainingString: string) {}
  generate(): string[] {
    return this.trainingString.split(' ')
  }
}

export class MarkovTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private dictionary: string[]) {}

  generate(options: TrainingStringOptions, alphabet: string[]): string[] {
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
/* 
export class GuidedCourseTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private charSet: CharacterSet) {}
  generate(options:SessionOptions) {
    let str = ""
    return str
  }
} */


