import { UserStringOptions } from "../../components/defaultState"
import MarkovChain from "./MarkovChain"
import { wordModifier } from "./wordModifier"
import LayoutUtil, { CharacterType, CharSet } from "../LayoutUtil"
import { CourseLevel } from "../../assets/Courses/Courses"

export interface TrainingStringGenerator {
  generate(options: UserStringOptions, layout?: LayoutUtil, lvl?: CourseLevel): string
}

export class MockTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private trainingString: string) {}
  generate(): string {
    return this.trainingString
  }
}

export class GuidedModeStringGenerator implements TrainingStringGenerator {
  constructor(private dictionary: string[]) {}

  generate(options: GuidedModeStringOptions, layout: LayoutUtil, lvl: CourseLevel): string {
    const alphabet = CharSet.uniqueChars(
      layout.charSet.subSet({ trainingLevel: lvl, type: CharacterType.LOWERCASE_LETTER })
    )
    function modifyWords(words: string[]): string[] {
      return words.map((word) => wordModifier(word, options, layout.charSet.subSet({ trainingLevel: lvl })))
    }
    
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
  generate(options: UserStringOptions) {
    let str: string
    if (options.fullSentences) {
      str = this.nextFullSentence(options.sourceText.value as string)
    } else {
      str = this.advanceCursorByWords(options)
    }
    return str
  }
  nextFullSentence(sourceText: string): string {
    let start = this.textCursor
    let end = this.advanceCursorByOne(sourceText.length, start)
    while (/\s/.test(sourceText[start])) {
      start = this.advanceCursorByOne(sourceText.length, start)
      end = this.advanceCursorByOne(sourceText.length, start)
      if (end < start) {
        start = end
        end = this.advanceCursorByOne(sourceText.length, start)
      }
    }
    while (sourceText[end] !== ".") {
      end = this.advanceCursorByOne(sourceText.length, end)
    }
    end = this.advanceCursorByOne(sourceText.length, end)
    this.textCursor = this.advanceCursorByOne(sourceText.length, end)
    return sourceText.slice(start, end)
  }
  advanceCursorByOne(max: number, pos?: number): number {
    return pos != null ? (pos + 1) % max : (this.textCursor + 1) % max
  }
  advanceCursorByWords(options: UserStringOptions): string {
    const source = options.sourceText.value as string
    const wordsPerString = options.wordsPerString.value as number
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
  generate(options: UserStringOptions) {
    let string = "todo"

    return string
  }
}
