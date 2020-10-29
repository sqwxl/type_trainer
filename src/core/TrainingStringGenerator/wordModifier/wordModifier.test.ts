import enUsQwerty from "../../../assets/Layouts/en_US"
import { defaultGuidedModeStringOptions, FormType, UserStringOption } from "../../../components/defaultState"
import LayoutUtil, { CharacterType, CharSet } from "../../LayoutUtil"
import { wordModifier } from "./wordModifier"

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

const options = {
  wordLength: new UserStringOption({value:
    {
      minLength: new UserStringOption({value: 3, formLabel: "Minimum", formType: FormType.Number, min: 3, max: 6, step: 1}),
      maxLength: new UserStringOption({value: 12, formLabel: "Maximum", formType: FormType.Number, min: 7, max: 15, step: 1}),
    },
    formLabel:"Word length",
    formType: FormType.Parent}
  ),
  wordModifierOptions: new UserStringOption({value:
    {
      caps: new UserStringOption({ value: false, formLabel: "Aa", formType: FormType.Switch }),
      punct: new UserStringOption({ value: false, formLabel:  "Punctuation", formType: FormType.Switch}),
      syms: new UserStringOption({  value: false, formLabel: "Symbols", formType:  FormType.Switch }),
      nums: new UserStringOption({ value: false, formLabel: "0-9", formType: FormType.Switch}),
    },
    formLabel: "Options",
    formType: FormType.Parent},
  ),
  modifyingLikelihood: new UserStringOption({ value: 1, formLabel: "% modified", formType: FormType.Number, min: 0, max: 1, step: 0.1 }),
  wordsPerString: new UserStringOption({ value: 6, formLabel: "Words per session", formType: FormType.Number, min: 1, max: 100, step: 1 }),
}
it("modifies strings according to options", () => {
  const testWord = "mouse"
  expect(wordModifier(testWord, options, charSet.charSet)).toEqual(testWord)

  console.log(UserStringOption.setOption(options.wordModifierOptions, 'caps', true))
  expect(wordModifier(testWord, options, charSet.charSet)).toEqual(
    testWord.slice(0, 1).toUpperCase().concat(testWord.slice(1))
  )
  options.wordModifierOptions.value.caps.value = false
  options.wordModifierOptions.value.punct.value = true
  let mod = wordModifier(testWord, options, charSet.charSet)
  let moded = contains(mod, punctuationChars)
  expect(moded).toBe(true)
  options.punct.value = false
  options.nums.value = true
  mod = wordModifier(testWord, options, charSet.charSet)
  moded = contains(mod, numbersChars)
  expect(moded).toBe(true)
  options.nums.value = false
  options.syms.value = true
  mod = wordModifier(testWord, options, charSet.charSet)
  moded = contains(mod, symbolsChars)
  expect(moded).toBe(true)
})
