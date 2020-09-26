import { SessionOptions } from "../../Components/TypeTrainer"
import { CharacterBehavior, CharacterSet, CharacterType } from "../kb_types"

export function modifyRawTrainingWord(word: string, options: SessionOptions, charSet: CharacterSet): string {
  const modifyingLikelyhood = 0.8
  let modificationShouldApply = () => Math.random() < modifyingLikelyhood

  // CAPITALIZE
  if (options.characters.caps && modificationShouldApply())
    capitalize()

  // ADD PUNCTUATION
  if (options.characters.punct && modificationShouldApply())
    punctuate()

  // ADD SYMBOL
  if (options.characters.syms && modificationShouldApply())
    addSymbol()

  // ADD NUMBER
  if (options.characters.nums && modificationShouldApply())
    addNumber()

  return word

  function addNumber() {
    word = symbolize(
      word,
      charSet.filter(char => char.type === CharacterType.NUMBER)
    )
  }

  function addSymbol() {
    word = symbolize(
      word,
      charSet.filter(char => char.type === CharacterType.SYMBOL)
    )
  }

  function punctuate() {
    word = symbolize(
      word,
      charSet.filter(char => char.type === CharacterType.PUNCTUATION)
    )
  }

  function capitalize() {
    word = word.slice(0, 1).toUpperCase().concat(word.slice(1))
  }
}

function symbolize(str: string, charSet: CharacterSet): string {
  let symbolized = str
  const randomCharIdx = Math.floor(Math.random() * charSet.length)
  const randomChar = charSet[randomCharIdx]
  const {glyph, behavior} = randomChar
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
      try {
        symbolized = glyph.concat(str, randomChar.bracketPair!)
      } catch (error) {
        console.error(error)
        throw new ReferenceError("Is bracketPair for " + glyph + " missing from character set?")
      }
      break
    case CharacterBehavior.SPLIT:
      if (str.length < 5 || typeof glyph !== 'string') break
      let splitIndex = 0
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

function isVowel(char: string, vowels: string[] = en_US.Vowels): boolean {
  return vowels.includes(char)
}
