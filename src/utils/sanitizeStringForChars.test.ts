import sanitizeStringForChars from "./sanitizeStringForChars";

const aMockCharset = (chars: string): string[] => chars.split('')
const aCharset = aMockCharset("abcdefghijklmnopqrstuvwxyz1234567890'\".\n")

describe('Formats strings properly', () => {
    it (`“ -> "`, () => {        
        assertReplaces(`"`, `“`)
    })
    it (`’ -> '`, () => {
        assertReplaces(`'`, `’`)
    })
    it (`… → ...`, () => {
        assertReplaces(`...`, `…`)
    })
    it (`removes double spaces`, () => {
        assertReplaces(` `, `  `)
    })
    it (`removes multi spaces`, () => {
        assertReplaces(` `, `        `)
    })
    it (`converts tabs to spaces`, () => {
        assertReplaces(` `, `\t`)
    })
    it (`carriage return to line feed`, () => {
        assertReplaces(`\n`, `\r`)
    })
    it (`triple line feeds to double line feed`, () => {
        assertReplaces(`\n\n`, `\n\n\n`)
    })
    it (`converts multi line feeds to double line feed`, () => {
    assertReplaces(`\n\n`, `\n\n\n\n\n\n\n`)
})
    it (`converts mixed line feeds, tabs, spaces to double line feed`, () => {
    assertReplaces(`\n\n`, `\n \n   \t\n    \n \n\n \t\r\t\n`)
})
    it (`remove characters which aren't part of the character set`, () => {
        expect(sanitizeStringForChars("abcde", aMockCharset("abcd"))).toBe("abcd")
    })
})

function assertReplaces(expected: string, actual: string){
    const frmt = sanitizeStringForChars(actual, aCharset)
    expect(frmt).toEqual(expected)
}