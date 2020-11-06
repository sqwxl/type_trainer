import { Language } from "../Language"

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
  /* constructor(language: Language, lvl: CourseLevel) {
    this.language = language
    this.lvl = lvl
  } */

  generate(options: any): string {
    return "todo"
  }
  /* 
    const alphabet = Language.uniqueChars(
      layout.charSet.subSet({ trainingLevel: lvl, type: 'LOWERCASE_LETTER' })
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
  } */
}

type CursorPos = { isValid: boolean; index?: number }

export class PracticeModeStringGenerator implements TrainingStringGenerator {
  private _sentences: string[]
  constructor(private language: Language, private _sourceText: string, private _textCursor: number = 0, private _sentenceCursor = 0) {
    // TODO: ensure sourceText has been sanitized
    // TODO: make language-aware
    this._sentences = this.parseSentences()
  }

  generate() {
    let str: string
    str = this._sentences[this._sentenceCursor++]
    return str
  }

  reset(): void {
    this._sentenceCursor = this._textCursor = 0
  }

  get sourceText(): string {
    return this._sourceText
  }

  private parseSentences(): string[] {
    const sentences: string[] = []
    let sentence = this.nextSentence()
    while (sentence.isFound) {
      sentences.push(sentence.str!)
      sentence = this.nextSentence()
    }
    return sentences
  }

  private nextSentence(): { isFound: boolean; str?: string } {
    // TODO: make dynamic and language-agnostic
    const txt = this._sourceText

    let cursor: CursorPos = { isValid: true, index: this._textCursor }
    const isLetterAt = (idx: number) => {
      return this.language.alphaMap[txt[idx]] != null
    }
    const isPeriodMarkAt = (idx: number): boolean => {
      const ch = txt[idx]
      return ch === "." || ch === "!" || ch === "?"
    }
    const isBracketAt = (idx: number): boolean => {
      const ch = txt[idx]
      const prev = this.cursorTo(idx - 1)
      const prevCh = prev.isValid ? txt[prev.index!] : undefined
      const next = this.cursorTo(idx + 1)
      const nextCh = next.isValid ? txt[next.index!] : undefined
      // Differentiate between single-quote and apostrophe
      if (ch === "'") {
        const isApostrophe = prevCh != null && nextCh != null && isLetterAt(prev.index!) && isLetterAt(next.index!)
        return !isApostrophe
      } else if (ch === '"') return true
      return false
    }
    const isWhiteSpace = (ch: string) => ch === " " || ch === "\t" || ch === "\n"

    // Move cursor to first non-white character
    while (isWhiteSpace(txt[cursor.index!])) {
      let next = this.cursorTo(cursor.index! + 1)
      if (!next.isValid) return { isFound: false }
      cursor = next
    }
    const startIdx = cursor.index

    // Move end cursor to the end of sentence
    let endOfSentence = false
    let bracketOpen = false
    let periodMarkFound = false
    do {
      if (!cursor.isValid) endOfSentence = true
      // Check for opening bracket
      if (isBracketAt(cursor.index!)) {
        bracketOpen = !bracketOpen
        if(!bracketOpen && periodMarkFound) endOfSentence = true
      }
      // Check for period mark
      if (isPeriodMarkAt(cursor.index!)) {
        periodMarkFound = true
        if (!bracketOpen) endOfSentence = true
      }
      cursor = this.cursorTo(cursor.index! + 1)
    } while (!endOfSentence)
    const endIdx = cursor.index

    // If end == start position, return no sentence found
    if (startIdx === endIdx) return { isFound: false }

    // Return the found sentence
    const sentence = txt.slice(startIdx, endIdx)
    return { isFound: true, str: sentence }
  }

  private cursorTo(idx: number): CursorPos {
    if (idx < 0 || idx > this._sourceText.length) return { isValid: false }
    return { isValid: true, index: idx }
  }
  // private advanceCursorByWords(): string {
  //   let count = 0
  //   let words: string[] = []
  //   let start = this.textCursor
  //   let end = this.advanceCursorByOne(this._sourceText.length, start)
  //   let getNextWord = (): string => {
  //     while (/\s/.test(this._sourceText[start])) {
  //       start = this.advanceCursorByOne(this._sourceText.length, start)
  //       end = this.advanceCursorByOne(this._sourceText.length, start)
  //       if (end < start) {
  //         start = end
  //         end = this.advanceCursorByOne(this._sourceText.length, start)
  //       }
  //     }
  //     while (!/\s/.test(this._sourceText[end])) {
  //       end = this.advanceCursorByOne(this._sourceText.length, end)
  //       if (end < start) throw new RangeError("Can't generate next word; perhaps the sourceText string is too short?")
  //     }
  //     return this._sourceText.slice(start, end)
  //   }

  //   while (count <= options.wordsPerString) {
  //     words.push(getNextWord())
  //     count++
  //   }
  //   return words.join(" ")
  // }
}

export class CodeModeStringGenerator {
  generate(options: any) {
    let string = "todo"

    return string
  }
}
