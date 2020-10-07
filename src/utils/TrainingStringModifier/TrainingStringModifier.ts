import enUsQwerty from "../../assets/Layouts/en_US"
import { WordModifierOptions } from "../../Components/TypeTrainer"
import { CharacterSet, CharacterBehavior, CharacterType } from "../LayoutUtil"

function isVowel(char: string, vowels: string[] = enUsQwerty.vowels): boolean {
  return vowels.includes(char)
}

function symbolize(str: string, charSet: CharacterSet): string {
  let symbolized = str
  const randomCharIdx = Math.floor(Math.random() * charSet.length)
  const randomChar = charSet[randomCharIdx]
  const { glyph, behavior } = randomChar
  let splitIndex
  switch (behavior) {
    case CharacterBehavior.PREPEND:
      symbolized = glyph.concat(str)
      break
    case CharacterBehavior.APPEND:
    case CharacterBehavior.SEQUENTIAL:
      symbolized = str.concat(glyph)
      break
    case CharacterBehavior.PREPEND_OR_APPEND:
      symbolized = Math.random() < 0.5 ? glyph.concat(str) : str.concat(glyph)
      break
    case CharacterBehavior.BRACKET:
      if (randomChar.bracketPair) {
        symbolized = glyph.concat(str, randomChar.bracketPair as string)
      }
      break
    case CharacterBehavior.SPLIT:
      if (str.length < 5 || typeof glyph !== "string") break
      // Try to split somewhere after 2nd and before 2nd-to-last letters -- not between two vowels
      for (let i = 2; i < str.length - 3; i++) {
        if (!isVowel(str[i]) && !isVowel(str[i + 1])) {
          splitIndex = i
          break
        }
      }
      if (splitIndex === 0) break
      symbolized = str.slice(0, splitIndex).concat(glyph, str.slice(splitIndex))
      break
    default:
      break
  }
  return symbolized
}

export function modifyRawTrainingWord(
  word: string,
  options: WordModifierOptions,
  charSet: CharacterSet,
  likelyhood: number
): string {
  const modificationShouldApply = (): boolean => Math.random() < likelyhood

  function addNumber(word: string): string {
    const numbers = charSet.filter(char => char.type === CharacterType.NUMBER)
    if (numbers.length === 0) return word
    return symbolize(
      word,
      charSet.filter(char => char.type === CharacterType.NUMBER)
    )
  }

  function addSymbol(word: string): string {
    const symbols = charSet.filter(char => char.type === CharacterType.SYMBOL)
    if (symbols.length === 0) return word
    return symbolize(word, symbols)
  }

  function punctuate(word: string): string {
    const punctuation = charSet.filter(char => char.type === CharacterType.PUNCTUATION)
    if (punctuation.length === 0) return word
    return symbolize(word, punctuation)
  }

  function capitalize(word: string): string {
    return word.slice(0, 1).toUpperCase().concat(word.slice(1))
  }
  // CAPITALIZE
  if (options.caps && modificationShouldApply()) word = capitalize(word)

  // ADD PUNCTUATION
  if (options.punct && modificationShouldApply()) word = punctuate(word)

  // ADD SYMBOL
  if (options.syms && modificationShouldApply()) word = addSymbol(word)

  // ADD NUMBER
  if (options.nums && modificationShouldApply()) word = addNumber(word)

  return word
}
