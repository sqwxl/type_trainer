import { CharacterBehavior, Character } from "../LayoutUtil"

interface ICharacterApplier {
  apply(str: string, character: Character): string
}


export class PrependCharacterApplier implements ICharacterApplier {
  apply(str: string, character: Character): string {
    if (character.behavior !== CharacterBehavior.PREPEND) return str
    return character.glyph + str
  }
}

export class AppendCharacterApplier implements ICharacterApplier {
  apply(str: string, character: Character): string {
    if (character.behavior !== CharacterBehavior.APPEND) return str
    return str + character.glyph
  }
}

export class PrependOrAppendCharacterApplier implements ICharacterApplier {
  apply(str: string, character: Character): string {
    if (character.behavior !== CharacterBehavior.PREPEND_OR_APPEND) return str
    return Math.random() < 0.5 ? character.glyph + str : str + character.glyph
  }
}

export class BracketCharacterApplier implements ICharacterApplier {
  apply(str: string, character: Character): string {
    if (character.behavior !== CharacterBehavior.BRACKET) return str
    if (character.bracketPair != null) return character.glyph + str + character.bracketPair
    return character.glyph + str + character.glyph
  }
}

export class SplitCharacterApplier implements ICharacterApplier {
  apply(str: string, character: Character): string {
    if (str.length < 5) return str
    // Try to split somewhere after 2nd and before 2nd-to-last letters -- not between two vowels
    for (let i = 2; i < str.length - 3; i++) {
      if (!isVowel(str[i]) && !isVowel(str[i + 1])) {
        splitIndex = i
        break
      }
    }

    function isVowel(char: string, vowels: string[] = enUsQwerty.vowels): boolean {
      return vowels.includes(char)
    }
    if (splitIndex === 0) break
    symbolized = str.slice(0, splitIndex).concat(glyph, str.slice(splitIndex))
  }
}

export class OperatorCharacterApplier implements ICharacterApplier {
  apply(str: string, character: Character): string {
    return 'todo'
  }
}


export default class CharacterApplier {
  apply(str: string, character: Character): string {
    let ca
    switch (character.behavior) {
      case CharacterBehavior.PREPEND:
        ca = new PrependCharacterApplier()
        break
      case CharacterBehavior.APPEND:
        ca = new AppendCharacterApplier()
        break
      case CharacterBehavior.PREPEND_OR_APPEND:
        ca = new PrependOrAppendCharacterApplier()
        break
      case CharacterBehavior.BRACKET:
        ca = new BracketCharacterApplier()
        break
      case CharacterBehavior.OPERATOR:
        ca = new OperatorCharacterApplier()
        break
      default:
        return str
    }
    return ca.apply(str, character)
  }
}
