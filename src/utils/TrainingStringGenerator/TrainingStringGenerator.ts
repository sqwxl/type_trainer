import { SessionOptions } from "../../Components/TypeTrainer"
import * as en_US from "../../assets/Layouts/en_US"
import MarkovChain from "./MarkovChain"
import { CharacterType } from "../kb_types"
import CharSet from "../CharSet"
import { modifyRawTrainingWord } from "../TrainingStringModifier/TrainingStringModifier"

export interface TrainingStringGenerator {
  generate(options: SessionOptions, charSet?: CharSet): string[]
}

export class MockTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private trainingString: string) {}
  generate(options: SessionOptions): string[] {
    return this.trainingString.split(' ')
  }
}

export class MarkovTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private dictionary: string[]) {}

  generate(options: SessionOptions, charSet: CharSet = new CharSet(en_US.QWERTY_CharSet)): string[] {
    // Return empty string if all characters options are false
    if (Object.values(options.characters).every(v => !v)) return [""]
    let letters = charSet.extractCharType(CharacterType.LOWERCASE_LETTER)
    // get markovchain based on restricted dictionary (based on fullcharset/traininglevel)
    const chain = this.newMarkovChainFromLettersArray(letters)

    
    let words: Array<string> = []
    while (words.length < options.wordsPerString) {
      let word = ''
      try {
        word = chain.generate(options.markov)
      } catch (error) {
        // console.log(error.message)
        const { minLength, maxLength } = options.markov
        const length = minLength + Math.floor(Math.random() * (maxLength - minLength))
        for (let i = 0; i < length; i++ ) {
          const letter = letters[Math.floor(Math.random() * letters.length)]
          word = word.concat(letter)
        }
      }
      word = modifyRawTrainingWord(word, options, charSet.fullCharSet)
      words.push(word)
    }

    return words
  }

  private newMarkovChainFromLettersArray(allowedLetters: string[]): MarkovChain {
    const dict = this.dictionary.filter(word => {
      for (let letter of word) {
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


