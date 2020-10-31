import { UserStringOption, FormType } from "../../components/defaultState"
import { mockCharacters, mockCharacterSet } from "../../utils/mockValues"
import { CharacterType } from "../CharacterSet"
import { NumsWordModifier, CapsWordModifier, PunctWordModifier } from "./WordModifiers"


const NOOP_OPTIONS = {
  wordModifierOptions: new UserStringOption({
    value: {
      caps: new UserStringOption({ value: false, formLabel: "Aa", formType: FormType.Switch }),
      punct: new UserStringOption({ value: false, formLabel: "Punctuation", formType: FormType.Switch }),
      syms: new UserStringOption({ value: false, formLabel: "Symbols", formType: FormType.Switch }),
      nums: new UserStringOption({ value: false, formLabel: "0-9", formType: FormType.Switch }),
    },
    formLabel: "Options",
    formType: FormType.Parent,
  }),
  modifyingLikelihood: new UserStringOption({
    value: 1,
    formLabel: "% modified",
    formType: FormType.Number,
    min: 0,
    max: 1,
    step: 0.1,
  }),
}



describe("NumsWordModifier", () => {
  const numberChars = mockCharacterSet.ofType(CharacterType.NUMBER)
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

