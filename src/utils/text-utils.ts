const basicSanitize = (str: string): string => {
  let sanitized = str
  // if (/\S/.test(str)) str.trim()
  sanitized = sanitized.replace(/\r/g, "\n") // (unescaped) Carriage Return to Line Feed
  sanitized = sanitized.replace(/[’‚]/g, "'") // Curly single-quote to standard
  sanitized = sanitized.replace(/[“”„]/g, '"') // Curly double-quotes to standard
  sanitized = sanitized.replace(/…/g, "...") // Ellipsis to three periods
  return sanitized
}

const whiteSpaceSanitize = (str: string) => {
  let sanitized = str
  sanitized = sanitized.replace(/\t/g, " ") // Tabs
  sanitized = sanitized.replace(/(\n\s*){3,}/g, "\n\n") // Multi returns to double
  sanitized = sanitized.replace(/  +/g, " ") // Multi space
  return sanitized
}
export function sanitizeStringForGlyphs(str: string | undefined, chars?: string[]): string {
  if (str == null) return ""
  if (chars == null) return str

  const includedCharMap: { [char: string]: boolean } = {
    " ": true,
  }
  
  for (const char of chars) {
    if (!includedCharMap[char]) {
      includedCharMap[char] = true
      includedCharMap[char.toUpperCase()] = true
    }
  }
  
  let sanitized = whiteSpaceSanitize(basicSanitize(str))
  
  let resultStr = ""
  for (const ltr of sanitized) {
    if (includedCharMap[ltr]) {
      resultStr += ltr
    }
  }

  return resultStr
}
export function sanitizeCode(str: string): string {
  let sanitized = String.raw`${str}`
  sanitized = basicSanitize(sanitized)
  function tabs(match: string, p1: string, offset: number, string: string) {
    return '\n'+p1.replace(/ {2}/g, '\t')
  }
  sanitized = sanitized.replace(/\n([ {2}]+)/g, tabs)
  return String.raw`${sanitized}`
}
