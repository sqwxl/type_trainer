import { mockCharacters, mockCharacterSet } from "../../utils/mockValues"
import { NumsWordModifier, CapsWordModifier, PunctWordModifier } from "./WordModifiers"
/* 

const NOOP_OPTIONS = {
  wordModifierOptions: new StringGeneratorOption({
    value: {
      caps: new StringGeneratorOption({ value: false, formLabel: "Aa", formType: FormType.Switch }),
      punct: new StringGeneratorOption({ value: false, formLabel: "Punctuation", formType: FormType.Switch }),
      syms: new StringGeneratorOption({ value: false, formLabel: "Symbols", formType: FormType.Switch }),
      nums: new StringGeneratorOption({ value: false, formLabel: "0-9", formType: FormType.Switch }),
    },
    formLabel: "Options",
    formType: FormType.Parent,
  }),
  modifyingLikelihood: new StringGeneratorOption({
    value: 1,
    formLabel: "% modified",
    formType: FormType.Number,
    min: 0,
    max: 1,
    step: 0.1,
  }),
}
 */


describe.skip("NumsWordModifier", () => {
  const numberChars = mockCharacterSet.characters.filter(ch => ch.type === 'NUMBER')
 it("should not alter string when not enabled", () => {
    expect(new NumsWordModifier(false, numberChars).modify("word")).toEqual("word")
  })
  
  it("should add a number to a word when enabled", () => {
    const numbersRE = /\d/
    expect(new NumsWordModifier(true, numberChars).modify("word")).toMatch(numbersRE)
  })
})


describe("CapsWordModifier", () => {
  it("should not alter string when not enabled", () => {
    expect(new CapsWordModifier(false).modify("word")).toEqual("word")
  })
  
  it("should capitalize the first letter when enabled", () => {
    expect(new CapsWordModifier(true).modify("word")).toEqual('Word')
  })
})

describe('PunctWordModifier', () => {

  it.skip("should not alter string when not enabled", () => {
    expect(new PunctWordModifier(false, mockCharacters).modify("word")).toEqual("word")
  })
})

