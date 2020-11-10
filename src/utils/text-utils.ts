const basicSanitize = (str: string): string => {
  let sanitized = str
  sanitized = sanitized.replace(/\r/g, "\n") // (unescaped) Carriage Return to Line Feed
  sanitized = sanitized.replace(/(\n\s*){3,}/g, "\n\n") // Multi returns to double
  sanitized = sanitized.replace(/[’‚]/g, "'") // Curly single-quote to standard
  sanitized = sanitized.replace(/[“”„]/g, '"') // Curly double-quotes to standard
  sanitized = sanitized.replace(/…/g, "...") // Ellipsis to three periods
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
  
  let sanitized = basicSanitize(str)

  sanitized = sanitized.replace(/\t/g, " ") // Tabs
  sanitized = sanitized.replace(/  +/g, " ") // Multi space
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
  return String.raw`${sanitized}`
}
