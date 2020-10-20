import { defaultGuidedModeStringOptions } from "../../Components/TypeTrainer"
import { GuidedModeStringGenerator } from "./TrainingStringGenerator"
import {dict as english}  from "../../assets/Dictionaries/english.json"
import { GuidedModeStringOptions } from "../../Components/TypeTrainer"
import LayoutUtil, { CharacterType, CharSet } from "../LayoutUtil"
import Courses, { CourseLevel } from "../Courses"
import enUsQwerty from "../../assets/Layouts/en_US"

const layout = new LayoutUtil(enUsQwerty)
const generator = new GuidedModeStringGenerator(english)
const options: GuidedModeStringOptions = { ...defaultGuidedModeStringOptions }
const course = Courses.guidedCourse

function testStringAgainstAllowedLetters(str: string, allowedLetters: RegExp): void {
  // console.log("generated markov string:" + str.join(' '))
  for (const ltr of str) {
    expect(allowedLetters.test(ltr)).toBe(true)
  }
}

function newRegExpFromStrArr(letters: string[]): RegExp {
  return new RegExp("[".concat(letters.join(''), "\\s]"))
}

function testMarkovLevel(options: GuidedModeStringOptions, generator: GuidedModeStringGenerator, lvl: CourseLevel): void {
  testStringAgainstAllowedLetters(generator.generate(options, layout, lvl), newRegExpFromStrArr(CharSet.uniqueChars(layout.charSet.subSet({trainingLevel: lvl, type: CharacterType.LOWERCASE_LETTER})).concat([' '])))
}



describe("TrainingStringGenerator", () => {
  it("should generate a string for a given set of characters", () => {
    
    const str = generator.generate(options, layout, course.levels[0])
    expect(str.length).toBeTruthy()
  })})
describe("TrainingStringGenerator: Markov Chains", () => {
  it("produces a string of words based on a training level using markov chains", () => {
    for (let lvl = 0; lvl < course.levels.length; lvl++) {
      testMarkovLevel(options, generator, course.levels[lvl])
    }
  })
})


