import CharacterSet, { Character } from "./CharacterSet"
import { KeyCode } from "./KeyCode"

export class Language {
  characterSet: CharacterSet
  vowels: string[]
  dictionary: string[]
  characters: Character[]
  alphabet: string[]
  numbers: string[]
  punctuation: string[]
  specials: string[]
  alphaMap: {[ch: string]: true}
  uniqueGlyphs: string[]
  uniqueKeyCodes: KeyCode[]
  // TODO terminators: Character[]
  constructor(characterSet: CharacterSet, vowels: string[], dictionary: string[]) {
    this.dictionary = dictionary
    this.characterSet = characterSet
    this.vowels = vowels
    this.characters = this.characterSet.characters
    this.uniqueGlyphs = CharacterSet.uniqueGlyphs(this.characters)
    this.uniqueKeyCodes = this.characterSet.uniqueKeyCodes()
    this.alphabet = this.characterSet.letterSet.map(({glyph}) => glyph)
    this.numbers = this.characterSet.numberSet.map(({glyph}) => glyph)
    this.punctuation = this.characterSet.punctSet.map(({glyph}) => glyph)
    this.specials = this.characterSet.specialSet.map(({glyph}) => glyph)
    this.alphaMap = {}
    this.alphabet.forEach(ch => {
      this.alphaMap[ch] = true
      this.alphaMap[ch.toUpperCase()] = true
    })
    // TODO this.terminators = 
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
