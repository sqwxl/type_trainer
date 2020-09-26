import { defaultSessionOptions } from "../../Components/TypeTrainer"
import { MarkovTrainingStringGenerator } from "./TrainingStringGenerator"
import dict from "../../assets/english_words_array.json"
import { SessionOptions } from "../../Components/TypeTrainer"
import CharSet from "../CharSet"
import { QWERTY_CharSet } from "../../assets/Layouts/en_US"
import { GuidedCourseLevels } from "../models"
import { CharacterSet, CharacterType } from "../kb_types"

const charSet = new CharSet(QWERTY_CharSet)

describe("TrainingStringGenerator", () => {
  it("should generate an array of strings", () => {
    const generator = new MarkovTrainingStringGenerator(dict.dict)
    const str = generator.generate(defaultSessionOptions)
    expect(str.length).toBeTruthy()
  })})
describe("TrainingStringGenerator: Markov Chains", () => {
  it("produces a string of words based on training level using markov chains", () => {
    const options: SessionOptions = { ...defaultSessionOptions }
    const generator = new MarkovTrainingStringGenerator(dict.dict)
    for (let lvl = 0; lvl < GuidedCourseLevels.length; lvl++) {
      options.trainingLevelIndex = lvl
      const lvlCharSet = charSet.charSetAtTrainingLevel(GuidedCourseLevels[lvl])
      testMarkovLevel(options, generator, lvlCharSet)
    }
  })
})



function testMarkovLevel(options: SessionOptions, generator: MarkovTrainingStringGenerator, charSet: CharSet) {
  testStringAgainstAllowedLetters(generator.generate(options, charSet), newRegExpFromRestrictedSet(options))
}

function testStringAgainstAllowedLetters(str: string[], allowedLetters: RegExp) {
  // console.log("generated markov string:" + str.join(' '))
  for (let ltr of str.join('')) {
    expect(allowedLetters.test(ltr)).toBe(true)
  }
}

function newRegExpFromRestrictedSet(options: SessionOptions) {
  return new RegExp(
    "[".concat(
      charSet.charSetAtTrainingLevel(GuidedCourseLevels[options.trainingLevelIndex])
        .extractCharType(CharacterType.LOWERCASE_LETTER)
        .join(""),
      "\\s]"
    )
  )
}

