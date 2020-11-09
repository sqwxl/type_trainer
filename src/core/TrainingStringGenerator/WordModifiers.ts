import { Character } from "../CharacterSet"

export interface IWordModifier {
  modify(word: string): string
}

export const CapsWordModifier = (enabled: boolean) => (word: string): string => {
    if (!enabled) {
      return word
    }
    return word.slice(0, 1).toUpperCase().concat(word.slice(1))
  }


export const PunctWordModifier = (enabled: boolean, punctSet: Character[]) => (word: string): string => {
  if (!enabled || punctSet.length === 0) return word
}
  

export const NumsWordModifier = (enabled: boolean, numbers: Character[]) => (word: string): string => {
  const randomNumber = (): Character =>  numbers[Math.floor(Math.random() * numbers.length)]
  if (!enabled || numbers.length === 0) return word
  return  word + randomNumber().glyph
}

export const SpecialWordModifier = (enabled: boolean,specials: Character[]) => (word: string): string => {
    if (!enabled) {
      return word
    }
    return "todo"
  }



const WordModifiers = [CapsWordModifier, NumsWordModifier, PunctWordModifier, SpecialWordModifier]
export default WordModifiers