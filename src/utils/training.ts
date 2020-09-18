import { FingerZone, FingerZoneChars } from "../Layouts/layouts"
import { TrainingLevel } from "./models"

export function getCharactersPerFinger(trainingLevel: number) {
  return TrainingLevel[trainingLevel].reduce((keys: Array<string>, fz: FingerZone) => {
    return keys.concat(FingerZoneChars[fz as string])
  }, [])
}

