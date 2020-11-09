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

describe("NumsWordModifier", () => {
  it("should not alter string when not enabled", () => {
    expect(NumsWordModifier(false, mockCharacterSet.numberSet)("word")).toEqual("word")
  })
  it("should add a number to a word when enabled", () => {
    const numbersRE = /\d/
    expect(NumsWordModifier(true, mockCharacterSet.numberSet)("word")).toMatch(numbersRE)
  })
})

describe("CapsWordModifier", () => {
  it("preserves string when not enabled", () => {
    expect(CapsWordModifier(false)("word")).toEqual("word")
  })
  it("should capitalize the first letter when enabled", () => {
    expect(CapsWordModifier(true)("word")).toEqual("Word")
  })
})

describe("PunctWordModifier", () => {
  it("preserves string when not enabled", () => {
    expect(PunctWordModifier(false, mockCharacterSet.punctSet)("word")).toEqual("word")
  })
})
