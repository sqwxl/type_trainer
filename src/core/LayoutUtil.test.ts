/* eslint-disable @typescript-eslint/no-non-null-assertion */
import LayoutUtil, { CharSet } from "./LayoutUtil"
import enUsQwerty from "../assets/Layouts/en_US"
import Courses from "../assets/Courses/Courses"

const layout = new LayoutUtil(enUsQwerty)

describe("charSets by finger", () => {
  it("returns the appropriate charset for different finger combinations", () => {
    let lvl = 0
    let charSetLvl = layout.charSet.charSetAtCourseLevel(Courses.fingers.levels[lvl++])
    expect(CharSet.uniqueKeyCodes(charSetLvl).length).toEqual(16)
    charSetLvl = layout.charSet.charSetAtCourseLevel(Courses.fingers.levels[lvl++])
    expect(CharSet.uniqueKeyCodes(charSetLvl).length).toEqual(24)
    charSetLvl = layout.charSet.charSetAtCourseLevel(Courses.fingers.levels[lvl++])
    expect(CharSet.uniqueKeyCodes(charSetLvl).length).toEqual(32)
    charSetLvl = layout.charSet.charSetAtCourseLevel(Courses.fingers.levels[lvl++])
    expect(CharSet.uniqueKeyCodes(charSetLvl).length).toEqual(47)
  })
})
describe("charSets by row/hand/finger (guided course)", () => {
  it("returns the appropriate charset for each training level", () => {
    let lvl = 0
    let charSetLvl = layout.charSet.charSetAtCourseLevel(Courses.guidedCourse.levels[lvl++])
    expect(CharSet.uniqueKeyCodes(charSetLvl).length).toEqual(2)
    charSetLvl = layout.charSet.charSetAtCourseLevel(Courses.guidedCourse.levels[lvl++])
    expect(CharSet.uniqueKeyCodes(charSetLvl).length).toEqual(3)
    charSetLvl = layout.charSet.charSetAtCourseLevel(Courses.guidedCourse.levels[lvl++])
    expect(CharSet.uniqueKeyCodes(charSetLvl).length).toEqual(4)
    charSetLvl = layout.charSet.charSetAtCourseLevel(Courses.guidedCourse.levels[8])
    expect(CharSet.uniqueKeyCodes(charSetLvl).length).toEqual(11)
    const charSetFullLetters = layout.charSet.charSetAtCourseLevel(Courses.guidedCourse.levels.find(({description}) => description === "Full letters")!)
    expect(CharSet.uniqueKeyCodes(charSetFullLetters).length).toEqual(34)
    
    const charSetFullKeyboard = layout.charSet.charSetAtCourseLevel(Courses.guidedCourse.levels.find(({description}) => description === "Full keyboard")!)
    expect(CharSet.uniqueKeyCodes(charSetFullKeyboard).length).toEqual(47)
  })
})
