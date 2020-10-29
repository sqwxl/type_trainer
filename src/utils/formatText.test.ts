import formatText, { regExpFromCharArr } from "./formatText";
import { defaultLayout } from '../components/defaultState'
import { CharSet } from "../core/LayoutUtil";
const chars = CharSet.uniqueChars(defaultLayout.charSet.charSet)


describe('Formats strings properly', () => {
    it ('generates correct regExp', () => {
        const re = regExpFromCharArr(['\\', '*', '?', '{', '/', ']', ':', '\'', '^'])
        expect(re.test(`\\`)).toBe(false)
        expect(re.test(`*`)).toBe(false)
        expect(re.test(`'`)).toBe(false)
        expect(re.test(`?`)).toBe(false)
        expect(re.test(`a`)).toBe(true)
        expect(re.test(`abc^`)).toBe(false)
    })

    it ('formats strings', () => {
        const text = `The [Portion] of those: \\hall/ ^ * 9. “people’s”…`
        const formatted = formatText(text, chars)
        expect(formatted).toEqual(`The [Portion] of those \\hall/ ^ * "people's"...`)
    })
})