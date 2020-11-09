import Courses, { Course } from "../../assets/courses/Courses"
import English from "../../assets/languages/english/English"
import qwerty from '../../assets/keyboard_layouts/en_qwerty'
import { GuidedModeStringGenerator, PracticeModeStringGenerator, CodeModeStringGenerator } from "./TrainingStringGenerator"
import { charsAtCourseLevel } from "../../utils/course-utils"
import CharacterSet from "../CharacterSet"

const testCourseLevels = Courses.guidedCourse.levels
const practiceEnglishGenerator = (txt: string) => new PracticeModeStringGenerator(English, txt)
const guidedEnglishGenerator = new GuidedModeStringGenerator(qwerty, English, testCourseLevels)



describe('GuidedModeStringGenerator', () => {
  const assertContains = (options: any, wanted: string) => {
    const words = guidedEnglishGenerator.generate(options)
    console.log(`generated: ${words} \nwants to include: ${wanted}`)
    expect(words.split('').every(ch => wanted.split('').includes(ch))).toBeTruthy()
  }

  it('should generate a string', () => {
    expect(typeof guidedEnglishGenerator.generate({guidedLevelIndex: 0}) === 'string').toBeTruthy()
  })
  it ("should restrict to proper characters at all levels", () => {
    for (let lvl = 0; lvl < Courses.guidedCourse.levels.length; lvl++) {
      const level = testCourseLevels[lvl]
      const expected = CharacterSet.uniqueGlyphs(charsAtCourseLevel(English.characterSet, level, qwerty)).join('')+' '
      assertContains({guidedLevelIndex: lvl}, expected)
    }
  })
})
describe('PracticeModeStringGenerator', () => {
  
  const assertGenerates = (str: string, result: string[]) => {
    const g = practiceEnglishGenerator(str)
    const len = result.length
    for (let n = 0; n < len; n++) {
      expect(g.generate()).toEqual(result[n])
    }
  }
  it('should generate a string', () => {
    expect(typeof practiceEnglishGenerator('test').generate() === 'string').toBeTruthy()
  })
  it('should accept empty string and outputs empty string', () => {
    assertGenerates('', [''])
  })
  it('should generates successive sentences', () => {
    const str = `Test sentence1. Test sentence2? "Test sentence3!" 'Test sentence4!'`
    assertGenerates(str, [`Test sentence1.`, `Test sentence2?`, `"Test sentence3!"`,`'Test sentence4!'`])
  })
  it('should parse strings containing quoted text', () => {
    const str = `James, while John had had "had", had had "had had"; "had had" had had a better effect on the teacher.`
    assertGenerates(str, [`James, while John had had "had", had had "had had"; "had had" had had a better effect on the teacher.`])
  })
  it(`shouldn't confuse single quotes and apostrophes`, () => {
    const str = `The hound's sent was good. 'Throughout Pierce's life.'`
    assertGenerates(str, [`The hound's sent was good.`, `'Throughout Pierce's life.'`])
  })
  it.skip(`shouldn't confuse plural apostrophes with quotes`, () => {
    const str = `"Rock n' roll" is good sometimes. But really, I prefer 'R n' B'.`
    assertGenerates(str, [`"Rock n' roll" is good sometimes.`, `But really, I prefer 'R n' B'.`])
  })

  it ("skips inner periods", () => {
    const str = `All the social-chauvinists are now "Marxists" (don't laugh!). ​And more and more`
    assertGenerates(str, [`All the social-chauvinists are now "Marxists" (don't laugh!).`,  `​And more and more`])
  })
  it (`shouldn't mind line feeds`, () => {
    const str = `First line and \nsecond lines of a single sentence.\nThe following sentence.\n\nThe final sentence.`
    assertGenerates(str, [`First line and \nsecond lines of a single sentence.`, `The following sentence.`, `The final sentence.`])
  })
  it ("shouldn't mind tabs", () => {
    const str = "Firs\tSeconde\tThird. Last."
    assertGenerates(str, ["Firs\tSeconde\tThird.", "Last."])
  })
  it ("should merges sentences smaller than 5 characters", () => {
    const str = "1. Was it. 2. D. Poll. 3. Peanuts"
    assertGenerates(str, ["1. Was it.", "2. D. Poll.", "3. Peanuts"])
  })
  it ("should preserve strings of period marks", () => {
    const str = `One... Two!!! Three?!?! Four.`
    assertGenerates(str, ['One...', 'Two!!!', 'Three?!?!', 'Four.'])
  })
})


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