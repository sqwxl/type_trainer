import { defaultGuidedModeStringOptions, UserStringOptions } from "../../components/defaultState"
import { GuidedModeStringGenerator } from "./TrainingStringGenerator"
import {dict as english}  from "../../assets/Dictionaries/english.json"
import { Language } from "../Language"
import Courses, { CourseLevel } from "../../assets/Courses/Courses"

it.todo('rewrite')

/*
const generator = new GuidedModeStringGenerator(english)
const options = { ...defaultGuidedModeStringOptions }
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

function testMarkovLevel(options: UserStringOptions, generator: GuidedModeStringGenerator, lvl: CourseLevel): void {
  testStringAgainstAllowedLetters(generator.generate(options, layout, lvl), newRegExpFromStrArr(Language.uniqueChars(layout.charSet.subSet({trainingLevel: lvl, type: CharacterType.LOWERCASE_LETTER})).concat([' '])))
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


 */