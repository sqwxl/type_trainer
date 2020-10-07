import { getCharSetAtTrainingLevel } from "./getCharSetAtTrainingLevel"
import enUsQwerty from '../../assets/Layouts/en_US'
import { TrainingLevel } from "../models"

it("returns the appropriate charset for a each training level", () => {
  const charSetLvl0 = getCharSetAtTrainingLevel(enUsQwerty.charSet, TrainingLevel[0])
  expect(charSetLvl0.length).toEqual(18)
  const charSetLvl1 = getCharSetAtTrainingLevel(enUsQwerty.charSet, TrainingLevel[1])
  expect(charSetLvl1.length).toEqual(33)
  const charSetLvl2 = getCharSetAtTrainingLevel(enUsQwerty.charSet, TrainingLevel[2])
  expect(charSetLvl2.length).toEqual(59)
  const charSetLvl3 = getCharSetAtTrainingLevel(enUsQwerty.charSet, TrainingLevel[3])
  expect(charSetLvl3.length).toEqual(73)
})
