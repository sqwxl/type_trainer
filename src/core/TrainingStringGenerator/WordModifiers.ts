import { Characters, Character } from "../KeyboardLayout"

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
  constructor(private enabled: boolean, private chars: Characters) {}
  modify(word: string): string {
    return ""
  }
}

export class NumsWordModifier implements IWordModifier {
  constructor(private enabled: boolean, private numbers: Characters) {}
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

const WordModifiers = [CapsWordModifier, NumsWordModifier, PunctWordModifier, SpecialWordModifier]
export default WordModifiers