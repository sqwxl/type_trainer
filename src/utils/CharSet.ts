import * as PhysicalKB from "./PhysicalKeyboard"
import { CharacterSet, CharacterType, KeyCode } from "./kb_types"
import { GuidedCourseLevel } from "./models"

export default interface CharSet {
  keyCodeFromChar(char: string): KeyCode
  extractCharType(type: CharacterType): string[]
  charSetAtTrainingLevel(trainingLevel: PhysicalKB.Finger[] | GuidedCourseLevel): CharSet
}

export default class CharSet implements CharSet {
  constructor(private _fullCharSet: CharacterSet) {}
  keyCodeFromChar(char: string): KeyCode {
    const charObj = this._fullCharSet.find(charObj => charObj.code.length === 1 && charObj.glyph === char)
    if (charObj != null) return charObj.code[0]
    return "NONE"
  }
  extractCharType(type: CharacterType): string[] {
    return this._fullCharSet.reduce((letters: string[], charObject) => {
      if (charObject.type === CharacterType.LOWERCASE_LETTER) {
        let char = charObject.glyph
        if (/[a-z]/.test(char)) letters = letters.concat(char)
      }
      return letters
    }, [])
  }
  charSetAtTrainingLevel(trainingLevel: PhysicalKB.Finger[] | GuidedCourseLevel): CharSet {
    let filteredSet: CharacterSet = [...this._fullCharSet]
    if (isFingerArray(trainingLevel)) {
      filteredSet = this._fullCharSet.filter(charObject => {
        const eachCharIsIncluded = charObject.code.every(code =>
          trainingLevel.includes(PhysicalKB.FingerMap[code].finger)
        )
        return eachCharIsIncluded
      })
    } else {
      filteredSet = this._fullCharSet.filter(charObject => {
        let rowCodes: KeyCode[] = []
        for (let row of trainingLevel.rows) {
          rowCodes = rowCodes.concat(PhysicalKB.Layout[row])
        }
        for (let charCode of charObject.code) {
          const codeIntersectsRows = rowCodes.includes(charCode)
          // filter out rows
          if (!codeIntersectsRows) return false
          // filter out hand
          const codeIntersectsHand =
            trainingLevel.hand === PhysicalKB.Hand.ANY || trainingLevel.hand === PhysicalKB.FingerMap[charCode].hand
          if (!codeIntersectsHand) return false
          // filter out finger
          const codeIntersectFinger =
            trainingLevel.fingers[0] === PhysicalKB.Finger.ANY ||
            trainingLevel.fingers.includes(PhysicalKB.FingerMap[charCode].finger)
          if (!codeIntersectFinger) return false
        }
        return true
      })
    }
    return new CharSet(filteredSet)

    function isFingerArray(x: PhysicalKB.Finger[] | GuidedCourseLevel): x is PhysicalKB.Finger[] {
      return x instanceof Array
    }
  }

  get uniqueKeyCodes(): KeyCode[] {
    return this._fullCharSet.reduce((arr: KeyCode[], charObj) => {
      for (let code of charObj.code) {
        if (!arr.includes(code)) {
          arr = arr.concat(code)
        }
      }
      return arr
    }, [])
  }

  get fullCharSet(): CharacterSet {
    return this._fullCharSet
  }
}
