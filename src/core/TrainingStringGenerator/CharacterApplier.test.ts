import { Character, CharacterBehavior, CharacterType } from '../LayoutUtil'
import CharacterApplier, { PrependCharacterApplier } from './CharacterApplier'

const cA = new CharacterApplier()
const emptyCharacter: Character = { code: ['NONE'], glyph: '', type: CharacterType.LOWERCASE_LETTER, behavior: CharacterBehavior.APPEND }
const prependCharacter: Character = { code: ["Digit3"], glyph: "#", type: CharacterType.SPECIAL, behavior: CharacterBehavior.PREPEND }
const appendCharacter: Character = { code: ["KeyA"], glyph: "a", type: CharacterType.LOWERCASE_LETTER, behavior: CharacterBehavior.APPEND }

describe('CharacterApplier', () => {
    it('Should not change strings when given an empty character', () => {
        expect(cA.apply('word', emptyCharacter))
    })
})

describe('PrependCharacterApplier', () => {
    const pCA = new PrependCharacterApplier()
    it('should reject an incompatible character', () => {
        expect(pCA.apply('word', appendCharacter)).toEqual('word')
    })
    it('should prepend a compatible character', () => {
        expect(pCA.apply('word', prependCharacter)).toEqual(prependCharacter.glyph + 'word')
    })
})