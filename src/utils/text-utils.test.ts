import { sanitizeCode, sanitizeStringForGlyphs } from "./text-utils"

const aMockCharset = (chars: string): string[] => chars.split("")
const aCharset = aMockCharset("abcdefghijklmnopqrstuvwxyz1234567890'\".\n")

describe("sanitizeStringForGlyphs", () => {
  it(`returns empty str when input is undefined`, () => {
    assertReplaces("", undefined)
  })
  it(`'' -> '' (empty to empty)`, () => {
    assertReplaces("", "")
  })
  it(`“ -> "`, () => {
    assertReplaces(`"`, `“`)
  })
  it(`’ -> '`, () => {
    assertReplaces(`'`, `’`)
  })
  it(`… → ...`, () => {
    assertReplaces(`...`, `…`)
  })
  it(`removes double spaces`, () => {
    assertReplaces(` `, `  `)
  })
  it(`removes multi spaces`, () => {
    assertReplaces(` `, `        `)
  })
  it(`converts tabs to spaces`, () => {
    assertReplaces(` `, `\t`)
  })
  it(`carriage return to line feed`, () => {
    assertReplaces(`\n`, `\r`)
  })
  it(`triple line feeds to double line feed`, () => {
    assertReplaces(`\n\n`, `\n\n\n`)
  })
  it(`converts multi line feeds to double line feed`, () => {
    assertReplaces(`\n\n`, `\n\n\n\n\n\n\n`)
  })
  it(`converts mixed line feeds, tabs, spaces to double line feed`, () => {
    assertReplaces(`\n\n`, `\n \n   \t\n    \n \n\n \t\r\t\n`)
  })
  it(`remove characters which aren't part of the character set`, () => {
    expect(sanitizeStringForGlyphs("abcde", aMockCharset("abcd"))).toBe("abcd")
  })
  function assertReplaces(expected: string, actual: string | undefined) {
    const frmt = sanitizeStringForGlyphs(actual, aCharset)
    expect(frmt).toEqual(expected)
  }
})

describe("sanitizeCode", () => {
  const assertReplaces = (expected: string, actual: string) => {
    const frmt = sanitizeCode(actual)
    expect(frmt).toEqual(expected)
  }
  it("should replace carriage returns with line feeds", () => {
    assertReplaces("\n", "\r")
  })
  it("should preserve tabs", () => {
    assertReplaces('\t', '\t')
  })
  it("should preserver escape character", () => {
      assertReplaces("line\nline", "line\nline")
  })
  it("should preserve literal line breaks", () => {
    let literalLB = 
`line
line`
    assertReplaces(literalLB, literalLB)
  })
  it("should preserve literal line breaks and escaped line break characters", () => {
    const mixed = 
`line\nline
line\nline`
    assertReplaces(mixed, mixed)
  })
  it("should replace leading groups of 2 spaces with a corresponding number of tabs", () => {
    const actual = 
`foo():
  line2:
    line3  :
      line4:`
    const expected =
`foo():
\tline2:
\t\tline3  :
\t\t\tline4:`
    assertReplaces(expected, actual)
  })
})
