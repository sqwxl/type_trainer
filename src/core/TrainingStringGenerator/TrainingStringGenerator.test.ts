import Courses from "../../assets/courses/Courses"
import English from "../../assets/languages/english/English"
import qwerty from "../../assets/keyboard_layouts/en_qwerty"
import {
  GuidedModeStringGenerator,
  PracticeModeStringGenerator,
  CodeModeStringGenerator,
} from "./TrainingStringGenerator"
import { charsAtCourseLevel } from "../../utils/course-utils"
import CharacterSet from "../CharacterSet"
import { sanitizeCode } from "../../utils/text-utils"

// GUIDED MODE
const testCourseLevels = Courses.guidedCourse.levels
const guidedEnglishGenerator = new GuidedModeStringGenerator(qwerty, English, testCourseLevels)
const assertContains = (options: any, wanted: string) => {
  const words = guidedEnglishGenerator.generate(options)
  expect(words.split("").every(ch => wanted.split("").includes(ch))).toBeTruthy()
}

describe("GuidedModeStringGenerator", () => {
  it("should generate a string", () => {
    expect(typeof guidedEnglishGenerator.generate({ guidedLevelIndex: 0 }) === "string").toBeTruthy()
  })
  it("should restrict to proper characters at all levels", () => {
    for (let lvl = 0; lvl < Courses.guidedCourse.levels.length; lvl++) {
      const level = testCourseLevels[lvl]
      const expected = CharacterSet.uniqueGlyphs(charsAtCourseLevel(English.characterSet, level, qwerty)).join("") + " "
      assertContains({ guidedLevelIndex: lvl }, expected)
    }
  })
})

// PRACTICE MODE
const practiceEnglishGenerator = (txt: string) => new PracticeModeStringGenerator(English, txt)
let assertGenerates = (str: string, result: string[]) => {
  const g = practiceEnglishGenerator(str)
  const len = result.length
  for (let n = 0; n < len; n++) {
    expect(g.generate()).toEqual(result[n])
  }
}

describe("PracticeModeStringGenerator", () => {
  it("should generate a string", () => {
    expect(typeof practiceEnglishGenerator("test").generate() === "string").toBeTruthy()
  })
  it("should accept empty string and outputs empty string", () => {
    assertGenerates("", [""])
  })
  it("should generates successive sentences", () => {
    const str = `Test sentence1. Test sentence2? "Test sentence3!" 'Test sentence4!'`
    assertGenerates(str, [`Test sentence1.`, `Test sentence2?`, `"Test sentence3!"`, `'Test sentence4!'`])
  })
  it("should parse strings containing quoted text", () => {
    const str = `James, while John had had "had", had had "had had"; "had had" had had a better effect on the teacher.`
    assertGenerates(str, [
      `James, while John had had "had", had had "had had"; "had had" had had a better effect on the teacher.`,
    ])
  })
  it(`shouldn't confuse single quotes and apostrophes`, () => {
    const str = `The hound's sent was good. 'Throughout Pierce's life.'`
    assertGenerates(str, [`The hound's sent was good.`, `'Throughout Pierce's life.'`])
  })
  it.skip(`shouldn't confuse plural apostrophes with quotes`, () => {
    const str = `"Rock n' roll" is good sometimes. But really, I prefer 'R n' B'.`
    assertGenerates(str, [`"Rock n' roll" is good sometimes.`, `But really, I prefer 'R n' B'.`])
  })

  it("skips inner periods", () => {
    const str = `All the social-chauvinists are now "Marxists" (don't laugh!). ​And more and more`
    assertGenerates(str, [`All the social-chauvinists are now "Marxists" (don't laugh!).`, `​And more and more`])
  })
  it(`shouldn't mind line feeds`, () => {
    const str = `First line and \nsecond lines of a single sentence.\nThe following sentence.\n\nThe final sentence.`
    assertGenerates(str, [
      `First line and \nsecond lines of a single sentence.`,
      `The following sentence.`,
      `The final sentence.`,
    ])
  })
  it("shouldn't mind tabs", () => {
    const str = "Firs\tSeconde\tThird. Last."
    assertGenerates(str, ["Firs\tSeconde\tThird.", "Last."])
  })
  it("should merges sentences smaller than 5 characters", () => {
    const str = "1. Was it. 2. D. Poll. 3. Peanuts"
    assertGenerates(str, ["1. Was it.", "2. D. Poll.", "3. Peanuts"])
  })
  it("should preserve strings of period marks", () => {
    const str = `One... Two!!! Three?!?! Four.`
    assertGenerates(str, ["One...", "Two!!!", "Three?!?!", "Four."])
  })
})

// CODE MODE
// first line of code
// second line of code
// third line of code
// fourth line of code
// fifth line of code
// sixth line of code
// seventh line of code
// eigth line of code
let g: CodeModeStringGenerator
let mockCode = sanitizeCode(`first line of code
second line of code
third line of code
fourth line of code
fifth line of code
sixth line of code
seventh line of code
eigth line of code`)

let firstFour = sanitizeCode(`first line of code
second line of code
third line of code
fourth line of code
`)
let secondFour = sanitizeCode(`fifth line of code
sixth line of code
seventh line of code
eigth line of code`)

describe("CodeModeStringGenerator", () => {
  beforeEach(() => {
    g = new CodeModeStringGenerator(mockCode)
  })
  it("should generate a string", () => {
    expect(typeof g.generate() === "string").toBeTruthy()
  })
  test("with its default options, it should generate the first 4 lines of code fed to the constructor", () => {
    expect(g.generate()).toEqual(firstFour)
  })
  test("with its default options, it should generate sequential 4-line chunks of the code fed to the constructor", () => {
    expect(g.generate()).toEqual(firstFour)
    expect(g.generate()).toEqual(secondFour)
  })
})
