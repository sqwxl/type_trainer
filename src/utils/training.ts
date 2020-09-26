import { FingerZone, FingerZoneChars } from "./kb_types"
import { TrainingLevelFingers } from "./models"

export function getCharactersPerFinger(trainingLevel: number) {
  return TrainingLevelFingers[trainingLevel].reduce((keys: Array<string>, fz: FingerZone) => {
    return keys.concat(FingerZoneChars[fz as string])
  }, [])
}

