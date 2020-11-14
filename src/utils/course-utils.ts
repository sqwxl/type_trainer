import { CourseLevel } from "../assets/courses/Courses";
import CharacterSet, { Character } from "../core/CharacterSet";
import Keyboard, { Hand, Finger } from "../core/Keyboard";
import { KeyCode } from "../core/KeyCode";

export const charsAtCourseLevel = (charSet: CharacterSet, level: CourseLevel, keyboard: Keyboard): Character[] => {

  const filteredCodes = codesAtCourseLevel(charSet, level, keyboard)
  
  return charSet.characters.filter(({code}) => code.every(c => filteredCodes.includes(c)))
    
}

export const codesAtCourseLevel = (charSet: CharacterSet, level: CourseLevel, keyboard: Keyboard): KeyCode[] => {
  const specifiesRows = level.keyBoardRows != null;
  const specifiesHand = level.hand != null;
  const specifiesFingers = level.fingers != null && level.fingers.length > 0;
  const keyCodes = CharacterSet.uniqueKeyCodes(charSet.characters);
  
  if (!specifiesRows && !specifiesHand && !specifiesFingers) return keyCodes

  const rowCodes: KeyCode[] = []
  if (specifiesRows) {
    rowCodes.push(...level.keyBoardRows.reduce((codes: KeyCode[], row) => codes.concat(keyboard.keyCodeLayout[row]), []))
  }
  return keyCodes.filter(code => {
    if (specifiesRows) {
      const codeIntersectsRows = rowCodes.includes(code);
      // filter out rows
      if (!codeIntersectsRows) return false;
    }
    if (specifiesHand) {
      // filter out hand
      const codeIntersectsHand = level.hand === keyboard.fingerMap[code].hand || keyboard.fingerMap[code].hand === Hand.ANY || level.hand === Hand.ANY
      if (!codeIntersectsHand) return false;
    }
    // filter out finger
    if (specifiesFingers) {
      const codeIntersectsFinger = level.fingers?.[0] === Finger.ANY ||
        level.fingers?.includes(keyboard.fingerMap[code].finger);
      if (!codeIntersectsFinger) return false;
    }
    return true
  })
}