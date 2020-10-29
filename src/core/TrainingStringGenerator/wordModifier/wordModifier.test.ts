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

type IWordModifier2 = (str: string) => string

export interface IWordModifier {
    process(word: string): string;
}

class MinLengthWordModifier implements IWordModifier{
  process(word: string): string{  
    return ""
  }
}

class CapsWordModifier implements IWordModifier  {
  constructor(private enabled: boolean){

  }
  process(word: string): string{
    if (!this.enabled){
      return word;
    }
    return ""
  }
}

class WordProcessor {
  private wordModifiers : IWordModifier[] = []
  process(word: string): string{
    for (const wordMod of this.wordModifiers) {
      word = wordMod.process(word)
    }
    return word
  }
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

const NOOP_OPTIONS = {
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
}


describe("CapsWordModifier", ()=>{
  it("should keep the string as is if not enabled", () => {
    const wm = new CapsWordModifier(false)
    expect(wm.process("Word"))
  })
})

it("should not change the input string if ...", ( ) => {
  expect(wordModifier("mouse", NOOP_OPTIONS, charSet.charSet)).toEqual("mouse")
})



it("modifies strings according to options", () => {
  const testWord = "mouse"
  expect(wordModifier(testWord, options, charSet.charSet)).toEqual(testWord)

  console.log(options.wordModifierOptions.setNestedOption('caps', true))
  expect(wordModifier(testWord, options, charSet.charSet)).toEqual(
    testWord.slice(0, 1).toUpperCase().concat(testWord.slice(1))
  )
  options.wordModifierOptions.setNestedOption('caps', false)
  options.wordModifierOptions.setNestedOption('punct', true)
  let mod = wordModifier(testWord, options, charSet.charSet)
  let moded = contains(mod, punctuationChars)
  expect(moded).toBe(true)
  options.wordModifierOptions.setNestedOption('punct', false)
  options.wordModifierOptions.setNestedOption('nums', true)
  mod = wordModifier(testWord, options, charSet.charSet)
  moded = contains(mod, numbersChars)
  expect(moded).toBe(true)
  options.wordModifierOptions.setNestedOption('nums', false)
  options.wordModifierOptions.setNestedOption('syms', true)
  mod = wordModifier(testWord, options, charSet.charSet)
  moded = contains(mod, symbolsChars)
  expect(moded).toBe(true)
})
