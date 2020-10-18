import enUsQwerty from "../../assets/Layouts/en_US"
import LayoutUtil, { CharacterType, CharSet } from "../LayoutUtil"
import {defaultWordModifierOptions} from '../../Components/TypeTrainer'
import { modifyWord } from "./modifyWord"

const layout = new LayoutUtil(enUsQwerty)
const charSet = layout.charSet
const punctuationChars = CharSet.uniqueChars(layout.charSet.subSet({ type: CharacterType.PUNCTUATION }))
const numbersChars = CharSet.uniqueChars(layout.charSet.subSet({ type: CharacterType.NUMBER }))
const symbolsChars = CharSet.uniqueChars(layout.charSet.subSet({ type: CharacterType.SYMBOL }))
function contains(word: string, charArr: string[]): boolean {
  for (const char of word) {
    if (charArr.includes(char)) return true
  }
  return false
}

const options = defaultWordModifierOptions
it("modifies strings according to options", () => {
  const testWord = "mouse"
  expect(modifyWord(testWord, options, charSet.charSet, 1)).toEqual(testWord)
  options.caps = true
  expect(modifyWord(testWord, options, charSet.charSet, 1)).toEqual(
    testWord.slice(0, 1).toUpperCase().concat(testWord.slice(1))
  )
  options.caps = false
  options.punct = true
  let mod = modifyWord(testWord, options, charSet.charSet, 1)
  let moded = contains(mod, punctuationChars)
  expect(moded).toBe(true)
  options.punct = false
  options.nums = true
  mod = modifyWord(testWord, options, charSet.charSet, 1)
  moded = contains(mod, numbersChars)
  expect(moded).toBe(true)
  options.nums = false
  options.syms = true
  mod = modifyWord(testWord, options, charSet.charSet, 1)
  moded = contains(mod, symbolsChars)
  expect(moded).toBe(true)
})
