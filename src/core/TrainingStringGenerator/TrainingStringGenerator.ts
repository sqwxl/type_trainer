import { Course } from "../../assets/courses/Courses"
import { Language } from "../Language"
import MarkovChain from "./MarkovChain"
import { CapsWordModifier, NumsWordModifier, PunctWordModifier, SpecialWordModifier } from "./WordModifiers"

export interface TrainingStringGenerator {
  generate(options?: any): string
}

export class MockTrainingStringGenerator implements TrainingStringGenerator {
  constructor(private trainingString: string) {}
  generate(): string {
    return this.trainingString
  }
}

export class GuidedModeStringGenerator implements TrainingStringGenerator {
  constructor(private _language: Language, private _course: Course) {}

  newWordModifier = (options: any) => {
    const { guidedHasCaps, guidedHasPunctuation, guidedHasNumbers, guidedHasSpecials } = options
    const modifiers = fns: {(word: string): string => void}[]
    if (guidedHasCaps) modifiers.push(CapsWordModifier(guidedHasCaps))
    if (guidedHasPunctuation) modifiers.push(PunctWordModifier(this._language.characterSet.punctSet))
    if (guidedHasNumbers) modifiers.push(NumsWordModifier(this._language.characterSet.numberSet))
    if (guidedHasSpecials) modifiers.push(SpecialWordModifier(this._language.characterSet.specialSet))
    return (words: string[]) => {
      const moded = [...words]
      if (modifiers.length !== 0) return words.map(word => {
        for (const mod of modifiers) {
          word = mod(word)
        }
        return word
      })
      return words
    }
  }

  generate(options: any): string {
    const modifier = this.newWordModifier(options)
    const words = modifier(this.words(options))
    return words.join(" ")
  }

  words(options: any): string[] {
    // get markovchain based on restricted dictionary (based on fullcharset/traininglevel)
    const chain = this.newMarkovChainRestrictedToLetters(this._language.alphaMap)
    const { guidedLevelIndex, guidedCourse, guidedWordLength, guidedNumWords, guidedLikelihoodModified } = options

    let words: Array<string> = []
    while (words.length < guidedNumWords) {
      let word = ""
      try {
        // TODO: use better control flow rather than relying on chain to throw an error
        word = chain.generate(guidedWordLength)
      } catch (error) {
        // If MarkovChain was unsuccessful (because there weren't enough letters available)
        // produce a random string
        // console.error(error.message)
        const { min, max } = guidedWordLength
        const length = min + Math.floor(Math.random() * (max - min))
        for (let i = 0; i < length; i++) {
          const letter = this._language.alphabet[Math.floor(Math.random() * this._language.alphabet.length)]
          word = word.concat(letter)
        }
      }
      words.push(word)
    }
    return words
  }

  private newMarkovChainRestrictedToLetters(alphaMap: { [ch: string]: true }): MarkovChain {
    const byAlphaMap = (word: string) => !word.split("").some(ch => alphaMap[ch] == null)
    const filteredDict = this._language.dictionary.filter(byAlphaMap)
    return new MarkovChain(3, filteredDict)
  }
}

export class PracticeModeStringGenerator implements TrainingStringGenerator {
  private _textCursor: number
  private _sentenceCursor: number
  private _sentences: string[]
  constructor(private language: Language, private _sourceText: string) {
    // TODO: ensure sourceText has been sanitized
    // TODO: make language-aware
    this._textCursor = 0
    this._sentenceCursor = 0
    this._sentences = this.parseSentences()
  }

  generate(): string {
    // Generate subsequent sentence on each call
    const sentence = this._sentences[this._sentenceCursor]
    this._sentenceCursor = (this._sentenceCursor + 1) % this._sentences.length
    return sentence ? sentence : ""
  }

  /*  reset(): void {
    this._sentenceCursor = this._textCursor = 0
  } */

  get sourceText(): string {
    return this._sourceText
  }

  private parseSentences(): string[] {
    const sentences: string[] = []
    let sentence = this.sentence()
    while (sentence.wasFound) {
      sentences.push(sentence.str!)
      sentence = this.sentence()
    }
    return sentences
  }

  private sentence(): { wasFound: boolean; str?: string } {
    // TODO: make dynamic and language-agnostic
    let cursor = this.cursorAt()
    const minimalLength = 5 // sentences shorter than this will be merged
    if (!cursor.isValid) return { wasFound: false }
    const isWhiteSpace = (ch: string) => ch === " " || ch === "\t" || ch === "\n"

    // Move cursor to first non-white character
    while (isWhiteSpace(cursor.ch)) {
      cursor = this.cursorAt(cursor.index + 1)
    }
    if (!cursor.isValid) return { wasFound: false }
    const startIdx = cursor.index

    // Move cursor to the end of sentence
    const isLetter = (ch: string) => this.language.alphaMap[ch] != null
    const isPeriodMark = (ch: string): boolean => ch === "." || ch === "!" || ch === "?"
    const isBracketMark = (ch: string): boolean => ch === '"' || ch === "'" // TODO: include parentheses, brackets...
    const openBrackets: { ch: string; wants: string }[] = []
    const isWantedBracket = (ch: string): boolean => openBrackets.some(bracket => bracket.wants === ch)

    let passedPeriod = false
    const isEndOfSentence = (cursor: { isValid: boolean; index: number; ch: string }): boolean => {
      const next = this.cursorAt(cursor.index + 1)
      if (!next.isValid) return true
      if (cursor.index - startIdx < minimalLength) return false
      if (openBrackets.length === 0) {
        if (isPeriodMark(cursor.ch) && !isPeriodMark(next.ch)) return true
        if (isBracketMark(cursor.ch) && passedPeriod) return true
      } else {
        if (isPeriodMark(cursor.ch)) passedPeriod = true
      }
      return false
    }

    let endReached = false
    const isApostrophe = (ch: string) => {
      const prev = this.cursorAt(cursor.index - 1)
      const next = this.cursorAt(cursor.index + 1)
      if (!next.isValid) return false
      return ch === "'" && isLetter(prev.ch) && isLetter(next.ch)
    } // TODO: add support for Torres', n', etc
    while (!endReached) {
      if (!cursor.isValid) {
        endReached = true
      } else {
        if (isBracketMark(cursor.ch) && !isApostrophe(cursor.ch)) {
          if (isWantedBracket(cursor.ch)) {
            openBrackets.splice(
              openBrackets.findIndex(({ wants }) => wants === cursor.ch),
              1
            )
          } else {
            openBrackets.push({ ch: cursor.ch, wants: cursor.ch }) // TODO: generalize
          }
        }
        endReached = isEndOfSentence(cursor)
      }
      if (!endReached) cursor = this.cursorAt(cursor.index + 1)
    }
    const endIdx = cursor.index

    // If end == start position, return no sentence found
    if (startIdx === endIdx) return { wasFound: false }

    // Return the found sentence
    const sentence = this._sourceText.slice(startIdx, endIdx + 1)
    this._textCursor = endIdx + 1
    return { wasFound: true, str: sentence }
  }

  private cursorAt(idx: number = this._textCursor) {
    if (idx < 0 || idx > this._sourceText.length) return { isValid: false, index: idx, ch: "" }
    return { isValid: true, index: idx, ch: this._sourceText[idx] }
  }
}

export class CodeModeStringGenerator {
  generate(options: any) {
    let string = "todo"

    return string
  }
}
