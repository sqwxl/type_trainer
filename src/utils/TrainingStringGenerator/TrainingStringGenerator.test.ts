import { defaultTrainingStringOptions } from "../../Components/TypeTrainer"
import { MarkovTrainingStringGenerator } from "./TrainingStringGenerator"
import {dict as english}  from "../../assets/Dictionaries/english.json"
import { TrainingStringOptions } from "../../Components/TypeTrainer"
import LayoutUtil, { CharacterType, CharSet } from "../LayoutUtil"
import Courses from "../Courses"
import enUsQwerty from "../../assets/Layouts/en_US"

const layout = new LayoutUtil(enUsQwerty)
const generator = new MarkovTrainingStringGenerator(english)
const options: TrainingStringOptions = { ...defaultTrainingStringOptions }
const course = Courses.guidedCourse

function testStringAgainstAllowedLetters(str: string[], allowedLetters: RegExp): void {
  // console.log("generated markov string:" + str.join(' '))
  for (const ltr of str.join('')) {
    expect(allowedLetters.test(ltr)).toBe(true)
  }
}

function newRegExpFromStrArr(letters: string[]): RegExp {
  return new RegExp("[".concat(letters.join(''), "\\s]"))
}

function testMarkovLevel(options: TrainingStringOptions, generator: MarkovTrainingStringGenerator, alphabet: string[]): void {
  testStringAgainstAllowedLetters(generator.generate(options, alphabet), newRegExpFromStrArr(alphabet))
}



describe("TrainingStringGenerator", () => {
  it("should generate an array of strings for a given set of characters", () => {
    
    const alphabet = CharSet.uniqueChars(layout.charSet.subSet({ type: CharacterType.LOWERCASE_LETTER }))
    const str = generator.generate(defaultTrainingStringOptions, alphabet)
    expect(str.length).toBeTruthy()
  })})
describe("TrainingStringGenerator: Markov Chains", () => {
  it("produces a string of words based on a training level using markov chains", () => {
    for (let lvl = 0; lvl < course.levels.length; lvl++) {
      const lvlCharSet = layout.charSet.subSet({ trainingLevel: course.levels[lvl], type: CharacterType.LOWERCASE_LETTER } )
      const alphabet = CharSet.uniqueChars(lvlCharSet)
      testMarkovLevel(options, generator, alphabet)
    }
  })
})


