import { Character, CharacterType, CharacterBehavior } from '../CharacterSet'
import { AppendCharacterInserter, BracketCharacterInserter, ICharacterInserter, OperatorCharacterInserter, PrependCharacterInserter, PrependOrAppendCharacterInserter, SplitCharacterInserter } from './CharacterInserter'

const nullCharacter: Character = { code: ['NONE'], glyph: '', type: CharacterType.NONE, behavior: CharacterBehavior.NONE }
const prependingCharacter: Character = { code: ["Digit3"], glyph: "#", type: CharacterType.SPECIAL, behavior: CharacterBehavior.PREPEND }
const appendingCharacter: Character = { code: ["KeyA"], glyph: "a", type: CharacterType.LOWERCASE_LETTER, behavior: CharacterBehavior.APPEND }
const prependOrAppendCharacter: Character = { code: ["Equal"], glyph: "++", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.PREPEND_OR_APPEND }
const pairedBracketingCharacter: Character = {
    code: ["Digit9", "Digit0"],
    glyph: "(", bracketPair:")",
    type: CharacterType.PUNCTUATION,
    behavior: CharacterBehavior.BRACKET,
  }
const unpairedBracketingCharacter: Character = { code: ["Quote"], glyph: '"', type: CharacterType.PUNCTUATION, behavior: CharacterBehavior.BRACKET }
const splittingCharacter: Character = { code: ["Digit2"], glyph: "@", type: CharacterType.SPECIAL, behavior: CharacterBehavior.SPLIT }
const operatorCharacter: Character = { code: ["Equal"], glyph: "=", type: CharacterType.PROGRAMMING, behavior: CharacterBehavior.OPERATOR }

const testStr = 'parfumerie'
const mockVowels = 'aeiou'.split('')


describe('PrependCharacterInserter', () => {
    const prepend = new PrependCharacterInserter()
    it('should ignore an incompatible character and return the str unchanged', () => {
        assertIncompatible(prepend)
    })
    it('should prepend a compatible character to the str', () => {
        expect(prepend.apply(testStr, prependingCharacter)).toEqual(prependingCharacter.glyph + testStr)
    })
})

describe('AppendCharacterInserter', () => {
    const append = new AppendCharacterInserter()
    it('should ignore an incompatible character and return the str unchanged', () => {
        assertIncompatible(append)
    })
    it('should append a compatible character to the str', () => {
        expect(append.apply(testStr, appendingCharacter)).toEqual(testStr + appendingCharacter.glyph)
    })
})

describe('PrependOrAppendCharacterInserter', () => {
    const preOrAppend = new PrependOrAppendCharacterInserter()
    it('should ignore an incompatible character and return the str unchanged', () => {
        assertIncompatible(preOrAppend)
    })
    it('should prepend or append a compatible character', () => {
        const mod = preOrAppend.apply(testStr, prependOrAppendCharacter)
        const isAppendedOrPrepended =  mod === prependOrAppendCharacter.glyph + testStr || mod === testStr + prependOrAppendCharacter.glyph
        expect(isAppendedOrPrepended).toBeTruthy()
    })
})

describe('BracketCharacterInserter', () => {
    const bracket = new BracketCharacterInserter()
    it('should ignore an incompatible character and return the str unchanged', () => {
        assertIncompatible(bracket)
    })
    it('should bracket a str with an unpaired bracket character', () => {
        expect(bracket.apply(testStr, unpairedBracketingCharacter)).toEqual(unpairedBracketingCharacter.glyph + testStr + unpairedBracketingCharacter.glyph)
    })
    it('should bracket a str with a paired bracket character', () => {
        expect(bracket.apply(testStr, pairedBracketingCharacter)).toEqual(pairedBracketingCharacter.glyph + testStr + pairedBracketingCharacter.bracketPair)
    })
})

describe('SplitCharacterInserter', () => {
    const split = new SplitCharacterInserter(mockVowels)
    it('should ignore an incompatible character and return the str unchanged', () => {
        assertIncompatible(split)
    })
    it('should ignore words shorted than 5 letters', () => {
        expect(split.apply('four', splittingCharacter)).toEqual('four')
    })
    it('should ignore words with only vowels after the 2nd and before the 2nd-to-last letter', () => {
        expect(split.apply('trouts', splittingCharacter)).toEqual('trouts')
    })
    it('should insert a character somewhere after the 2nd and before the 2nd-to-last letter for compatible words', () => {
        const mod = split.apply(testStr, splittingCharacter)
        const isCorrectlySplit = mod.slice(2, mod.length-3).match(new RegExp(splittingCharacter.glyph)) != null
        expect(isCorrectlySplit).toBeTruthy()
    })
})

describe('OperatorCharacterInserter', () => {
    const operator = new OperatorCharacterInserter()
    it('should ignore an incompatible character and return the str unchanged', () => {
        assertIncompatible(operator)
    })
    it('should add a space and the character to the end of the word', () => {
        expect(operator.apply(testStr, operatorCharacter)).toEqual(testStr + ' ' + operatorCharacter.glyph)
    })
})

function assertIncompatible(inserter: ICharacterInserter) {
    expect(inserter.apply(testStr, nullCharacter)).toEqual(testStr)
}