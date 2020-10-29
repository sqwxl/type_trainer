
export default function formatText(str: string, chars: string[]): string {
    let formatted = str
    
    formatted.replace(/[’‚]/g, "'")     // Curly single-quote
    formatted.replace(/[“”„]/g, '"')    // Curly double-quotes
    formatted.replace(/…/g, '...')      // Ellipsis
    const re = regExpFromCharArr(chars)
    formatted.replace(re, '')           // Remove all other unallowed characters

    return formatted
}

export function regExpFromCharArr(chars: string[]): RegExp {
    let specialChars = /[[\]*{}?!^/\\<=>:]/
    let str = chars.reduce((set: string[], char) => {
        if (specialChars.test(char)) {
            let esc = '\\'+char
            return set.includes(esc) ? set : set.concat(esc)
        } else {
            return set.includes(char) ? set : set.concat(char)
        }
    }, []).join('')
    return new RegExp('[^'.concat(str, ']'), 'ig')
}