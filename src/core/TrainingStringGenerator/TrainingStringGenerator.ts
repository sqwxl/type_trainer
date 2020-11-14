import { CourseLevel } from "../../assets/courses/Courses"
import { charsAtCourseLevel } from "../../utils/course-utils"
import { sanitizeCode } from "../../utils/text-utils"
import CharacterSet, { CharacterType, Character } from "../CharacterSet"
import Keyboard from "../Keyboard"
import { Language } from "../Language"
import CharacterInserter from "./CharacterInserter"
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
  constructor(private _keyboard: Keyboard, private _language: Language, private _courseLevels: CourseLevel[]) {}

  generate(options: any = {}): string {
    let words = this.newUnmodifiedWords(options)
    const modifier = this.newWordModifier(options)
    words = modifier(words)
    return words.join(" ")
  }

  private newWordModifier = ({
    guidedHasCaps = false,
    guidedHasNumbers = false,
    guidedHasPunctuation = false,
    guidedHasSpecials = false,
  }) => {
    const inserter = new CharacterInserter(this._language.vowels)
    const modifiers: { (word: string): string }[] = []
    if (guidedHasCaps) modifiers.push(CapsWordModifier())
    if (guidedHasNumbers) modifiers.push(NumsWordModifier(this._language.characterSet.numberSet))
    if (guidedHasPunctuation) modifiers.push(PunctWordModifier(this._language.characterSet.punctSet, inserter))
    if (guidedHasSpecials) modifiers.push(SpecialWordModifier(this._language.characterSet.specialSet, inserter))
    return (words: string[]) => {
      if (modifiers.length !== 0)
        return words.map(word => {
          for (const mod of modifiers) {
            word = mod(word)
          }
          return word
        })
      return words
    }
  }

  private newUnmodifiedWords(options: any): string[] {
    // get markovchain based on restricted dictionary (based on fullcharset/traininglevel)
    const {
      guidedLevelIndex,
      guidedWordLength = { min: 3, max: 12 },
      guidedNumWords = 10,
      guidedLikelihoodModified,
    } = options
    const alphaMap = this.alphaMapAtLevel(guidedLevelIndex)
    const letters = this._language.alphabet.filter(ch => alphaMap[ch] != null)
    const vowels = this._language.vowels.filter(vowel => alphaMap[vowel] != null)
    // hardcoded expeptions for english word generation
    const hasEnoughVowels = vowels.length >= 2 && !letters.every(letter => "piuoy".includes(letter))
    const wantsMarkovChain = hasEnoughVowels
    let newWord
    if (wantsMarkovChain) {
      const chain = this.newMarkovChain(alphaMap)
      newWord = (): string => chain.generate(guidedWordLength)
    } else {
      newWord = (): string => this.randomWordFrom(guidedWordLength, letters)
    }
    const words: Array<string> = []
    while (words.length < guidedNumWords) {
      words.push(newWord())
    }
    return words
  }
  randomWordFrom(length: { min: number; max: number } = { min: 6, max: 6 }, letters: string[]): string {
    const l = length.min + Math.floor(Math.random() * (length.max - length.min))
    let word = ""
    for (let i = 0; i < l; i++) {
      const letter = letters[Math.floor(Math.random() * letters.length)]
      word = word.concat(letter)
    }
    return word
  }
  private newMarkovChain(alphaMap: { [ch: string]: true } = this._language.alphaMap): MarkovChain {
    const byAlphaMap = (word: string) => !word.split("").some(ch => alphaMap[ch] == null)
    const filteredDict = this._language.dictionary.filter(byAlphaMap)
    return new MarkovChain(3, filteredDict)
  }

  private charsAtLevel(lvl: number, type: CharacterType = "LOWERCASE_LETTER"): Character[] {
    return charsAtCourseLevel(this._language.characterSet, this._courseLevels[lvl], this._keyboard).filter(
      ({ type: t }) => t === type
    )
  }

  private alphaMapAtLevel(lvl: number): { [ch: string]: true } {
    const level = this._courseLevels[lvl]

    if (level == null) return this._language.alphaMap

    const lvlMap: { [ch: string]: true } = {}
    const glyphs = CharacterSet.uniqueGlyphs(this.charsAtLevel(lvl))
    for (const glyph of glyphs) lvlMap[glyph] = true
    lvlMap[" "] = true // special case for space
    return lvlMap
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
    const isNewLine = (ch: string): boolean => ch === '\n'
    const brackets = this.language.characterSet.punctSet.filter(({ behavior }) => behavior === "BRACKET")
    const isBracketMark = (ch: string): boolean => CharacterSet.uniqueGlyphs(brackets).includes(ch) // TODO: include parentheses, brackets...
    const wantedBrackets: string[] = []
    const isWantedBracket = (ch: string): boolean => wantedBrackets.some(wanted => ch === wanted)

    const isEndOfSentence = (cursor: { isValid: boolean; index: number; ch: string }): boolean => {
      const next = this.cursorAt(cursor.index + 1)
      if (!next.isValid) return true
      if (cursor.index - startIdx < minimalLength) return false
      if ((isPeriodMark(cursor.ch) || isBracketMark(cursor.ch)) && isNewLine(next.ch)) return true
      if (wantedBrackets.length === 0 && !isPeriodMark(next.ch)) {
        // Successive period marks
        if (isPeriodMark(cursor.ch)) return true
        if (isBracketMark(cursor.ch) && sentenceHasPeriod) return true
      }
      return false
    }

    let sentenceHasPeriod = false
    let endReached = false
    const isApostrophe = (ch: string) => {
      if (ch !== "'") return false
      const prev = this.cursorAt(cursor.index - 1)
      const next = this.cursorAt(cursor.index + 1)
      if (!next.isValid) return false
      return isLetter(prev.ch) && isLetter(next.ch)
    } // TODO: add support for Torres', n', etc
    while (!endReached) {
      if (!cursor.isValid) {
        endReached = true
      } else {
        if (isBracketMark(cursor.ch) && !isApostrophe(cursor.ch)) {
          if (isWantedBracket(cursor.ch)) {
            wantedBrackets.splice(
              wantedBrackets.findIndex(wanted => cursor.ch === wanted),
              1
            )
          } else {
            const { glyph, bracketPair } = brackets.find(
              ({ glyph, bracketPair }) => cursor.ch === glyph || cursor.ch === bracketPair
            ) as { glyph: string; bracketPair: string }
            wantedBrackets.push(bracketPair != null ? bracketPair : glyph) // TODO: generalize
          }
        }
        if (isPeriodMark(cursor.ch) && wantedBrackets.length !== 0) sentenceHasPeriod = true
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

export class CodeModeStringGenerator implements TrainingStringGenerator {
  private _cursor: number
  private _code: string
  codeLines: number
  constructor(_code: string, codeLines: number = 4) {
    this._code = sanitizeCode(_code)
    this._cursor = 0
    this.codeLines = codeLines
  }
  generate(options?: any): string {
    const lines: string[] = []
    let cursor = this._cursor
    let start,
      end = 0
    for (let i = 0; i < this.codeLines; i++) {
      start = cursor
      end = this._code.indexOf("\n", start) + 1
      if (end <= 0) end = this._code.length
      const line = this._code.slice(start, end)
      lines.push(line)
      cursor = end
      if (cursor >= this._code.length) break
    }
    this._cursor = cursor % this._code.length
    return lines.join("")
  }
}
