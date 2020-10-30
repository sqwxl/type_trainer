import enUsQwerty from "../../assets/Layouts/en_US"
import { defaultGuidedModeStringOptions, FormType, UserStringOption } from "../../components/defaultState"
import LayoutUtil, { CharacterBehavior, CharacterType, CharSet } from "../LayoutUtil"
import { CapsWordModifier, NumsWordModifier, PunctWordModifier, wordModifier } from "./wordModifier"

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

const mockCharacterSet = [
  { code: ["KeyA"], glyph: "a", type: CharacterType.LOWERCASE_LETTER, behavior: CharacterBehavior.APPEND },
  { code: ["KeyB"], glyph: "b", type: CharacterType.LOWERCASE_LETTER, behavior: CharacterBehavior.APPEND },
  { code: ["KeyC"], glyph: "c", type: CharacterType.LOWERCASE_LETTER, behavior: CharacterBehavior.APPEND },
  { code: ["KeyD"], glyph: "d", type: CharacterType.LOWERCASE_LETTER, behavior: CharacterBehavior.APPEND },

  // DIGITS
  { code: ["Digit0"], glyph: "0", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit1"], glyph: "1", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit2"], glyph: "2", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit3"], glyph: "3", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit4"], glyph: "4", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit5"], glyph: "5", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit6"], glyph: "6", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit7"], glyph: "7", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit8"], glyph: "8", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },
  { code: ["Digit9"], glyph: "9", type: CharacterType.NUMBER, behavior: CharacterBehavior.APPEND },

  // PUNCTUATION
  { code: ["Comma"], glyph: ",", type: CharacterType.PUNCTUATION, behavior: CharacterBehavior.APPEND },
  { code: ["Quote"], glyph: "'", type: CharacterType.PUNCTUATION, behavior: CharacterBehavior.SPLIT },
  { code: ["Quote"], glyph: '"', type: CharacterType.PUNCTUATION, behavior: CharacterBehavior.BRACKET },

  // SYMBOLS
  { code: ["Digit2"], glyph: "@", type: CharacterType.SPECIAL, behavior: CharacterBehavior.SPLIT },
  { code: ["Digit3"], glyph: "#", type: CharacterType.SPECIAL, behavior: CharacterBehavior.PREPEND },
  { code: ["Digit4"], glyph: "$", type: CharacterType.SPECIAL, behavior: CharacterBehavior.APPEND },
  { code: ["Digit6"], glyph: "^", type: CharacterType.SPECIAL, behavior: CharacterBehavior.OPERATOR },
  { code: ["Backquote"], glyph: "`", type: CharacterType.SPECIAL, behavior: CharacterBehavior.BRACKET },
  { code: ["BracketLeft", "BracketRight"], glyph: "[", bracketPair: "]", type: CharacterType.SPECIAL, behavior: CharacterBehavior.BRACKET },

  /* /// PROGRAMMING CHARACTERS
  { code: ["Backquote"], glyph: "`", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.BRACKET },
  { code: ["BracketLeft", "BracketRight"], glyph: "[", bracketPair: "]", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.BRACKET },
  { code: ["BracketLeft", "BracketRight"], glyph: "{", bracketPair: "}", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.BRACKET },
  { code: ["Slash"], glyph: "/", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.SPLIT },
  { code: ["Backslash"], glyph: "\\", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.PREPEND },
  { code: ["Comma", "Period"], glyph: "<", bracketPair: ">", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.BRACKET },
  { code: ["Minus"], glyph: "_", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.SPLIT },
  { code: ["Minus"], glyph: "-", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR },
  { code: ["Equal"], glyph: "+", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR },
  { code: ["Digit8"], glyph: "*", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR },
  { code: ["Equal"], glyph: "=", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR },
  { code: ["Digit1","Equal"], glyph: "!=", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR },
  { code: ["Equal"], glyph: "==", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR },
  { code: ["Equal"], glyph: "++", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.PREPEND_OR_APPEND },
  { code: ["Comma","Period"], glyph: "<=", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR },
  { code: ["Comma","Period"], glyph: ">=", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR },
  { code: ["Digit5"], glyph: "%", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR } */
]

describe("NumsWordModifier", () => {

  it("should not alter string when not enabled", () => {
    expect(new NumsWordModifier(false, mockCharacterSet).modify("word")).toEqual("word")
  })
  
  it("should add a number to a word when enabled", () => {
    const numbers = /[0123456789]/
    expect(new NumsWordModifier(true, mockCharacterSet).modify("word")).toMatch(numbersRE)
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

  it("should not alter string when not enabled", () => {
    expect(new PunctWordModifier(false, mockCharSet).modify("word")).toEqual("word")
  })
})

it("modifies strings according to options", () => {
  const testWord = "mouse"
  expect(wordModifier(testWord, options, charSet.charSet)).toEqual(testWord)

  console.log(options.wordModifierOptions.setNestedOption("caps", true))
  expect(wordModifier(testWord, options, charSet.charSet)).toEqual(
    testWord.slice(0, 1).toUpperCase().concat(testWord.slice(1))
  )
  options.wordModifierOptions.setNestedOption("caps", false)
  options.wordModifierOptions.setNestedOption("punct", true)
  let mod = wordModifier(testWord, options, charSet.charSet)
  let moded = contains(mod, punctuationChars)
  expect(moded).toBe(true)
  options.wordModifierOptions.setNestedOption("punct", false)
  options.wordModifierOptions.setNestedOption("nums", true)
  mod = wordModifier(testWord, options, charSet.charSet)
  moded = contains(mod, numbersChars)
  expect(moded).toBe(true)
  options.wordModifierOptions.setNestedOption("nums", false)
  options.wordModifierOptions.setNestedOption("syms", true)
  mod = wordModifier(testWord, options, charSet.charSet)
  moded = contains(mod, symbolsChars)
  expect(moded).toBe(true)
})
