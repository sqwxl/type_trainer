import CharSet from "./CharSet"
import * as en_US from "../assets/Layouts/en_US"
import { GuidedCourseLevels } from "./models"
import { CharacterSet } from "./kb_types"
import { Finger } from "./PhysicalKeyboard"

const charSet = new CharSet(en_US.QWERTY_CharSet)

describe("charSets by finger", () => {
  it("returns the appropriate charset for different finger combinations", () => {
    let charSetLvl = charSet.charSetAtTrainingLevel([Finger.INDEX])
    expect(charSetLvl.uniqueKeyCodes.length).toEqual(16)
    charSetLvl = charSet.charSetAtTrainingLevel([Finger.INDEX, Finger.MIDDLE])
    expect(charSetLvl.uniqueKeyCodes.length).toEqual(24)
    charSetLvl = charSet.charSetAtTrainingLevel([Finger.INDEX, Finger.MIDDLE, Finger.RING])
    expect(charSetLvl.uniqueKeyCodes.length).toEqual(32)
    charSetLvl = charSet.charSetAtTrainingLevel([Finger.INDEX, Finger.MIDDLE, Finger.RING, Finger.PINKY])
    expect(charSetLvl.uniqueKeyCodes.length).toEqual(47)
  })
})
describe("charSets by row/hand/finger (guided course)", () => {
  it("returns the appropriate charset for a each training level", () => {
    let charSetLvl = charSet.charSetAtTrainingLevel(GuidedCourseLevels[0])
    expect(charSetLvl.uniqueKeyCodes.length).toEqual(2)
    charSetLvl = charSet.charSetAtTrainingLevel(GuidedCourseLevels[1])
    expect(charSetLvl.uniqueKeyCodes.length).toEqual(3)
    charSetLvl = charSet.charSetAtTrainingLevel(GuidedCourseLevels[2])
    expect(charSetLvl.uniqueKeyCodes.length).toEqual(4)
    charSetLvl = charSet.charSetAtTrainingLevel(GuidedCourseLevels[8])
    expect(charSetLvl.uniqueKeyCodes.length).toEqual(11)
    const charSetFullLetters = charSet.charSetAtTrainingLevel(GuidedCourseLevels.find(({description}) => description === "Full letters")!)
    expect(charSetFullLetters.uniqueKeyCodes.length).toEqual(34)
    
    const charSetFullKeyboard = charSet.charSetAtTrainingLevel(GuidedCourseLevels.find(({description}) => description === "Full keyboard")!)
    expect(charSetFullKeyboard.uniqueKeyCodes.length).toEqual(47)
  })
})

function printCharsToConsole(charset: CharacterSet): void {
  let codes = charset.map(({ code }) => [...code])
.reduce((arr, val) => {
  val.forEach(c => {
  if(!arr.includes(c)) arr = arr.concat(c);
  })
  return arr
}, [])
  console.log(codes, codes.length)
}
