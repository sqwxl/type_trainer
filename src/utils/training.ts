import { FingerZone, FingerZoneChars } from "../Layouts/layouts"
import { TrainingLevels } from "./models"

export function getCharactersPerFinger(trainingLevel: number) {
  return TrainingLevels[trainingLevel].reduce((keys: Array<string>, fz: FingerZone) => {
    return keys.concat(FingerZoneChars[fz as string])
  }, [])
}

