import {
  CodeModeStringOptions,
  GuidedModeStringOptions,
  PracticeModeStringOptions,
  StringOptions,
} from "../../Components/TypeTrainer"
import MarkovChain from "./MarkovChain"
import { modifyWord } from "../modifyWord/modifyWord"
import LayoutUtil, { CharacterType, CharSet } from "../LayoutUtil"
import { CourseLevel } from "../Courses"

export interface TrainingStringGenerator {
  generate(options: StringOptions, layout?: LayoutUtil, lvl?: CourseLevel): string
}

export class MockTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private trainingString: string) {}
  generate(): string {
    return this.trainingString
  }
}

/*
const { wordModifierOptions, modifyingLikelihood, spaces } = this.state.settings.stringOptions as GuidedModeStringOptions
        words = this.guidedModeText()
        const modifiedWords = words.map((word) =>
          modifyWord(
            word,
            wordModifierOptions,
            charSet.subSet({
              trainingLevel: this.getCurrentLevel(),
            }),
            modifyingLikelihood
          )
        )
        string = modifiedWords.join(spaces ? " " : "")

  
  private guidedModeText(): { words: string[], string: string } {
    const words = this.state.generator.generate(
      this.state.settings.stringOptions as GuidedModeStringOptions,
      CharSet.uniqueChars(
        this.state.settings.layout.charSet.subSet({
          trainingLevel: this.getCurrentLevel(),
          type: CharacterType.LOWERCASE_LETTER,
        })
      )
    )

    return { words, string }
  }
*/
export class GuidedModeStringGenerator implements TrainingStringGenerator {
  constructor(private dictionary: string[]) {}

  generate(options: GuidedModeStringOptions, layout: LayoutUtil, lvl: CourseLevel): string {
    const alphabet = CharSet.uniqueChars(
      layout.charSet.subSet({ trainingLevel: lvl, type: CharacterType.LOWERCASE_LETTER })
    )
    function modifyWords(words: string[]): string[] {
      return words.map((word) => modifyWord(word, options, layout.charSet.subSet({ trainingLevel: lvl })))
    }
    const nullSumOptions = !options.letters && Object.values(options.wordModifierOptions).every((v) => !v)
    // Return empty string if all characters options are false
    if (nullSumOptions) return ""
    // get markovchain based on restricted dictionary (based on fullcharset/traininglevel)
    const chain = this.newMarkovChainRestrictedToLetters(alphabet)

    let words: Array<string> = []
    while (words.length < options.wordsPerString) {
      let word = ""
      try {
        word = chain.generate(options.wordLength)
      } catch (error) {
        console.error(error.message)
        const { minLength, maxLength } = options.wordLength
        const length = minLength + Math.floor(Math.random() * (maxLength - minLength))
        for (let i = 0; i < length; i++) {
          const letter = alphabet[Math.floor(Math.random() * alphabet.length)]
          word = word.concat(letter)
        }
      }
      words.push(word)
    }
    words = modifyWords(words)
    return words.join(" ")
  }

  private newMarkovChainRestrictedToLetters(allowedLetters: string[]): MarkovChain {
    const dict = this.dictionary.filter((word) => {
      for (const letter of word) {
        if (!allowedLetters.includes(letter)) return false
      }
      return true
    })
    return new MarkovChain(3, dict)
  }
}

export class PracticeModeStringGenerator implements TrainingStringGenerator {
  constructor(private textCursor: number = 0) {}
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
    let end = this.advanceCursorByOne(source.length, start)
    while (/\s/.test(source[start])) {
      start = this.advanceCursorByOne(source.length, start)
      end = this.advanceCursorByOne(source.length, start)
      if (end < start) {
        start = end
        end = this.advanceCursorByOne(source.length, start)
      }
    }
    while (source[end] !== ".") {
      end = this.advanceCursorByOne(source.length, end)
    }
    this.textCursor = this.advanceCursorByOne(source.length, end)
    return source.slice(start, end)
  }
  advanceCursorByOne(max: number, pos?: number): number {
    return pos != null ? (pos + 1) % max : (this.textCursor + 1) % max
  }
  advanceCursorByWords({ source, wordsPerString }: PracticeModeStringOptions): string {
    let count = 0
    let words: string[] = []
    let start = this.textCursor
    let end = this.advanceCursorByOne(source.length, start)
    let getNextWord = (): string => {
      while (/\s/.test(source[start])) {
        start = this.advanceCursorByOne(source.length, start)
        end = this.advanceCursorByOne(source.length, start)
        if (end < start) {
          start = end
          end = this.advanceCursorByOne(source.length, start)
        }
      }
      while (!/\s/.test(source[end])) {
        end = this.advanceCursorByOne(source.length, end)
        if (end < start) throw new RangeError("Can't generate next word; perhaps the source string is too short?")
      }
      return source.slice(start, end)
    }

    while (count <= wordsPerString) {
      words.push(getNextWord())
      count++
    }
    return words.join(" ")
  }
}

export class CodeModeStringGenerator {
  constructor() {}
  generate(options: CodeModeStringOptions) {
    let string = "todo"

    return string
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
