import CharacterSet, { Character} from "./CharacterSet";

export class Language {
  private _characters: Character[]
  constructor(private _characterSet: CharacterSet, private _vowels: string[]) { 
    this._characters = this._characterSet.characters
  }
  get characterSet(): CharacterSet {
    return this._characterSet
  }
  get characters(): Character[] {
    return this._characters;
  }
  get vowels(): string[] {
    return this._vowels;
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
