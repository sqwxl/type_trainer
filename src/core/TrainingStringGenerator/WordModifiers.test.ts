import { mockCharacterSet } from "../../utils/mockValues"
import CharacterSet, { Character } from "../CharacterSet"
import CharacterInserter from "./CharacterInserter"
import { NumsWordModifier, CapsWordModifier, PunctWordModifier, SpecialWordModifier } from "./WordModifiers"
const mockVowels = "aeiou".split("")
const inserter = new CharacterInserter(mockVowels)
const numbers = mockCharacterSet.numberSet
const punctuation = mockCharacterSet.punctSet
const specials = mockCharacterSet.specialSet
const capsModifier = CapsWordModifier()
const numsModifier = NumsWordModifier(numbers)
const punctModifier = PunctWordModifier(punctuation, inserter)
const specialsModifier = SpecialWordModifier(specials, inserter)

const glyphMap = (cs: Character[]): { [ch: string]: true } => {
  const map: { [ch: string]: true } = {}
  cs.forEach(({ glyph: ch }) => (map[ch] = true))
  return map
}
const assertModifies = (modifier: (word: string) => string, word: string, cs: Character[]) => {
  const map = glyphMap(cs)
  expect(modifier(word).split("").some(ch => map[ch] != null)).toBeTruthy()
}
describe("CapsWordModifier", () => {
  it("should capitalize the first letter when enabled", () => {
    expect(capsModifier("word")).toEqual("Word")
  })
})

describe("NumsWordModifier", () => {
  it("should add a number to a word", () => {
    assertModifies(numsModifier, "word", numbers)
  })
})

describe("PunctWordModifier", () => {
  it("should insert at a punctuation mark", () => {
    assertModifies(punctModifier, "longEnoughToBeModedForSure", punctuation)
  })
})

describe("SpecialWordModifier", () => {
  it("should insert a special character", () => {
    assertModifies(specialsModifier, 'longEnoughToBeModedForSure', specials)
  })
})
