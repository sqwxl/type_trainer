import formatText from "./formatText";

const aMockCharset = (chars: string): string[] => chars.split('')
const aCharset = aMockCharset("abcdefghijklmnopqrstuvwxyz1234567890'\".\n")

describe('Formats strings properly', () => {
    it (`“ → "`, () => {        
        assertReplaces(`"`, `“`)
    })
    it (`’ → '`, () => {
        assertReplaces(`'`, `’`)
    })
    it (`😃 replaces … → ...`, () => {
        assertReplaces(`...`, `…`)
    })
    it (`😃 removes double spaces`, () => {
        assertReplaces(` `, `  `)
    })
    it (`😃 removes uber spaces`, () => {
        assertReplaces(` `, `        `)
    })
    it (`😃 converts tabs to spaces`, () => {
        assertReplaces(` `, `\t`)
    })
    it (`😃 converts line breaks to line feed`, () => {
        assertReplaces(`\n`, `\r`)
    })
    it (`😃 converts triple line feeds to double line feed`, () => {
        assertReplaces(`\n\n`, `\n\n\n`)
    })
    it (`😃 converts spaced fucked line feeds to double line feed`, () => {
        assertReplaces(`\n\n`, `\n \n   \n    \n \n\n \t\r\t\n`)
    })
    it (`remove characters which aren't part of the character set`, () => {
        expect(formatText("abcde", aMockCharset("abcd"))).toBe("abcd")
    })
})

function assertReplaces(expected: string, actual: string){
    const frmt = formatText(actual, aCharset)
    console.log(`expected : "${expected}", actual: "${actual}", formatted: "${frmt}"`)
    expect(frmt).toEqual(expected)
}