import { KeyCode } from "./KeyCode"

export enum CharacterType {
  NONE,
  LOWERCASE_LETTER,
  NUMBER,
  PUNCTUATION,
  SPECIAL,
  PROGRAMMING,
}
export enum CharacterBehavior {
  NONE,
  PREPEND,
  APPEND,
  PREPEND_OR_APPEND,
  SPLIT,
  BRACKET,
  OPERATOR,
}

export type Character = {
  code: KeyCode[]
  glyph: string
  bracketPair?: string
  type: CharacterType
  behavior: CharacterBehavior
}

export default class CharacterSet {
  constructor(private _characters: Character[]) {}
  get characters() {
    return this._characters
  }

  uniqueGlyphs(): string[] {
    return this._characters.reduce((uniqueGlyphs: string[], { glyph, bracketPair }) => {
      if (uniqueGlyphs.includes(glyph) || glyph.length > 1) return uniqueGlyphs
      uniqueGlyphs = uniqueGlyphs.concat(glyph)
      if (bracketPair == null || uniqueGlyphs.includes(bracketPair)) return uniqueGlyphs
      return uniqueGlyphs.concat(bracketPair)
    }, [])
  }

  uniqueKeyCodes(): KeyCode[] {
    return this._characters.reduce((arr: KeyCode[], character) => {
      for (const code of character.code) {
        if (!arr.includes(code)) {
          arr = arr.concat(code)
        }
      }
      return arr
    }, [])
  }

  mapGlyphToKeyCode(glyph: string): KeyCode {
    if (glyph == null) return "NONE"
    glyph = glyph.toLowerCase()
    const character = this._characters.find(character => character.code.length === 1 && character.glyph === glyph)
    if (character != null) return character.code[0]
    return "NONE"
  }

  ofType(type: CharacterType | CharacterType[], invert?: boolean): CharacterSet {
    let restricted = [...this._characters]
    if (type instanceof Array) {
      restricted = restricted.filter((char) =>
        invert ? (type as CharacterType[]).every((type) => type !== char.type) : char.type === options.type
      )
    } else {
      restricted = restricted.filter((char) => (invert ? char.type !== type : char.type === type))
    }
    return new CharacterSet(restricted)
  }
}
