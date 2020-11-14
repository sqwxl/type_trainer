import CharacterSet, { Character } from "./CharacterSet"
import { KeyCode } from "./KeyCode"

export class Language {
  characterSet: CharacterSet
  vowels: string[]
  dictionary: string[]
  characters: Character[]
  alphabet: string[]
  numbers: string[]
  punctuation: string[]
  specials: string[]
  alphaMap: {[ch: string]: true}
  uniqueGlyphs: string[]
  uniqueKeyCodes: KeyCode[]
  // TODO terminators: Character[]
  constructor(characterSet: CharacterSet, vowels: string[], dictionary: string[]) {
    this.dictionary = dictionary
    this.characterSet = characterSet
    this.vowels = vowels
    this.characters = this.characterSet.characters
    this.uniqueGlyphs = CharacterSet.uniqueGlyphs(this.characters)
    this.uniqueKeyCodes = CharacterSet.uniqueKeyCodes(this.characters)
    this.alphabet = this.characterSet.letterSet.map(({glyph}) => glyph)
    this.numbers = this.characterSet.numberSet.map(({glyph}) => glyph)
    this.punctuation = this.characterSet.punctSet.map(({glyph}) => glyph)
    this.specials = this.characterSet.specialSet.map(({glyph}) => glyph)
    this.alphaMap = {}
    this.alphabet.forEach(ch => {
      this.alphaMap[ch] = true
      this.alphaMap[ch.toUpperCase()] = true
    })
    // TODO this.terminators = 
  }
}
