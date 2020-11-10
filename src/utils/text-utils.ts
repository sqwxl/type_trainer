
    export function sanitizeStringForGlyphs(str: string | undefined, chars?: string[]): string {
    if (str == null) return ''
    if (chars == null) return str
    let formatted = str

    // console.log(chars)
    
    formatted = formatted.replace(/[’‚]/g, "'")     // Curly single-quote
    formatted = formatted.replace(/[“”„]/g, '"')    // Curly double-quotes
    formatted = formatted.replace(/…/g, '...')      // Ellipsis
    formatted = formatted.replace(/\t/g, ' ')       // Tabs
    formatted = formatted.replace(/  +/g, ' ');     // Multi space
    formatted = formatted.replace(/\r/g, '\n')      // Return to feed
    formatted = formatted.replace(/[\n\s*]{3,}/g, "\n\n");   


    const includedCharMap : {[char: string]: boolean} = {
        " " : true
    }
    
    for (const char of chars){
        if (!includedCharMap[char]){
            includedCharMap[char] = true
            includedCharMap[char.toUpperCase()] = true
        }
    }
    let resultStr = ""
    for (const ltr of formatted) {
        if (includedCharMap[ltr]){
            resultStr += ltr
        }
    }


    return resultStr
}
