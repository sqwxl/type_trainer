import { StandardFingerMap } from "../../assets/StandardPhysicalLayout";
import { CharacterSet, Finger } from "../../assets/kb_types";

export function getCharSetAtTrainingLevel(fullCharSet: CharacterSet, trainingLevel: Finger[]): CharacterSet {
  let filteredSet: CharacterSet = [...fullCharSet];
  filteredSet = fullCharSet.filter(charObject => {
    if (charObject.code instanceof Array) {
      const eachCharIsIncluded = charObject.code.every(code => trainingLevel.includes(StandardFingerMap[code].finger));
      if (eachCharIsIncluded)
        return true;
    } else if (trainingLevel.includes(StandardFingerMap[charObject.code].finger)) {
      return true;
    }
    return false;
  });
  return filteredSet;
}
