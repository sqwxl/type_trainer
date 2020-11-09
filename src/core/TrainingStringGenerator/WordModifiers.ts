import CharacterSet, { Character } from "../CharacterSet"
import CharacterInserter from "./CharacterInserter"

const randomEle = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

export const CapsWordModifier = () => (word: string): string => {
  return word.slice(0, 1).toUpperCase().concat(word.slice(1))
}

export const NumsWordModifier = (numberSet: Character[]) => (word: string): string => {
  if (numberSet.length === 0) return word
  return word + randomEle(numberSet).glyph
}

export const PunctWordModifier = (punctSet: Character[], inserter: CharacterInserter) => (word: string): string => {
  if (punctSet.length === 0) return word
  return inserter.apply(word, randomEle(punctSet))
}


export const SpecialWordModifier = (specialSet: Character[], inserter: CharacterInserter) => (word: string): string => {
  if (specialSet.length === 0) return word
  return inserter.apply(word, randomEle(specialSet))
}

const WordModifiers = [CapsWordModifier, NumsWordModifier, PunctWordModifier, SpecialWordModifier]
export default WordModifiers

