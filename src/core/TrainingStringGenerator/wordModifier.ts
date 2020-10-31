import { CharacterSet, Character } from "../LayoutUtil"
import CharacterInserter from "./CharacterInserter"

export interface IWordModifier {
  modify(word: string): string
}

export class CapsWordModifier implements IWordModifier {
  // Capitalizes the first letter of a given word
  constructor(private enabled: boolean) {}
  modify(word: string): string {
    if (!this.enabled) {
      return word
    }
    return word.slice(0, 1).toUpperCase().concat(word.slice(1))
  }
}

export class PunctWordModifier implements IWordModifier {
  constructor(private enabled: boolean, private chars: CharacterSet) {}
  modify(word: string): string {
    return ""
  }
}

export class NumsWordModifier implements IWordModifier {
  constructor(private enabled: boolean, private numbers: CharacterSet) {}
  modify(word: string): string {
    if (!this.enabled || this.numbers.length === 0) return word
    return  'TODO'
  }
  private randomNumber(): Character {
    return this.numbers[Math.floor(Math.random() * this.numbers.length)]
  }
}

export class SpecialWordModifier implements IWordModifier {
  // Adds symbols to strings
  constructor(private enabled: boolean) {}
  modify(word: string): string {
    if (!this.enabled) {
      return word
    }
    return "todo"
  }
}

export class WordProcessor {
  constructor(private characterInserter: CharacterInserter, private wordModifiers: IWordModifier[]) {
  }
  process(word: string): string {
    for (const wordMod of this.wordModifiers) {
      word = wordMod.modify(word)
    }
    return word
  }
}
