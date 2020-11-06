import CharacterSet, { Character } from "./CharacterSet"
import { KeyCode } from "./KeyCode"

export class Language {
  private _characters: Character[]
  private _alphabet: string[]
  private _alphaMap: {[ch: string]: true}
  private _uniqueGlyphs: string[]
  private _uniqueKeyCodes: KeyCode[]
  // TODO private _terminators: Character[]
  constructor(private _characterSet: CharacterSet, private _vowels: string[], private _dictionary: string[]) {
    this._characters = this._characterSet.characters
    this._uniqueGlyphs = this._characterSet.uniqueGlyphs()
    this._uniqueKeyCodes = this._characterSet.uniqueKeyCodes()
    this._alphabet = this._characterSet.alphabet()
    this._alphaMap = {}
    this._alphabet.forEach(ch => {
      this._alphaMap[ch] = true
      this._alphaMap[ch.toUpperCase()] = true
    })
    // TODO this._terminators = 
  }
  get alphabet(): string[] {
    return this._alphabet
  }
  get alphaMap(): {[ch: string]: true} {
    return this._alphaMap
  }
  get uniqueGlyphs(): string[] {
    return this._uniqueGlyphs
  }
  get uniqueKeyCodes(): KeyCode[] {
    return this._uniqueKeyCodes
  }
  get characterSet(): CharacterSet {
    return this._characterSet
  }
  get characters(): Character[] {
    return this._characters
  }
  get vowels(): string[] {
    return this._vowels
  }
  get dictionary(): string[] {
    return this._dictionary
  }

  // charSetAtCourseLevel(courseLevel: CourseLevel): Character[] {
  //   let filteredSet: Character[] = [...this._characters];

  //   const specifiesRows = courseLevel.keyBoardRows != null;
  //   const specifiesHand = courseLevel.hand != null;
  //   const specifiesFingers = courseLevel.fingers != null && courseLevel.fingers.length > 0;

  //   if (!specifiesRows && !specifiesHand && !specifiesFingers)
  //     return filteredSet;

  //   filteredSet = this._characters.filter((charObject) => {
  //     let rowCodes: KeyCode[] = [];
  //     if (specifiesRows) {
  //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //       for (const row of courseLevel.keyBoardRows!) {
  //         rowCodes = rowCodes.concat(PhysicalLayout[row]);
  //       }
  //     }
  //     for (const charCode of charObject.code) {
  //       if (specifiesRows) {
  //         const codeIntersectsRows = rowCodes.includes(charCode);
  //         // filter out rows
  //         if (!codeIntersectsRows)
  //           return false;
  //       }
  //       if (specifiesHand) {
  //         // filter out hand
  //         const codeIntersectsHand = courseLevel.hand === Hand.ANY || courseLevel.hand === FingerMap[charCode].hand;
  //         if (!codeIntersectsHand)
  //           return false;
  //       }
  //       // filter out finger
  //       if (specifiesFingers) {
  //         const codeIntersectsFinger = courseLevel.fingers?.[0] === Finger.ANY ||
  //           courseLevel.fingers?.includes(FingerMap[charCode].finger);
  //         if (!codeIntersectsFinger)
  //           return false;
  //       }
  //     }
  //     return true;
  //   });

  //   return filteredSet; //new LayoutUtil(filteredSet, this._keyLabels, this._vowels)
  // }
}
