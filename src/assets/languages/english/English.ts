import CharacterSet from "../../../core/CharacterSet"
import { Language } from "../../../core/Language"
import { dictionary } from "./english-dict.json"

const characterSet = new CharacterSet([
  // WHITESPACE
  { code: ["Tab"], glyph: "\t", type: "WHITESPACE", behavior: "NONE" },
  { code: ["Enter"], glyph: "\n", type: "WHITESPACE", behavior: "NONE" },
  { code: ["Space"], glyph: " ", type: "WHITESPACE", behavior: "NONE" },
  // ALPHABET
  { code: ["KeyA"], glyph: "a", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyB"], glyph: "b", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyC"], glyph: "c", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyD"], glyph: "d", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyE"], glyph: "e", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyF"], glyph: "f", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyG"], glyph: "g", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyH"], glyph: "h", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyI"], glyph: "i", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyJ"], glyph: "j", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyK"], glyph: "k", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyL"], glyph: "l", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyM"], glyph: "m", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyN"], glyph: "n", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyO"], glyph: "o", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyP"], glyph: "p", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyQ"], glyph: "q", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyR"], glyph: "r", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyS"], glyph: "s", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyT"], glyph: "t", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyU"], glyph: "u", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyV"], glyph: "v", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyW"], glyph: "w", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyX"], glyph: "x", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyY"], glyph: "y", type: "LOWERCASE_LETTER", behavior: "APPEND" },
  { code: ["KeyZ"], glyph: "z", type: "LOWERCASE_LETTER", behavior: "APPEND" },

  // DIGITS
  { code: ["Digit0"], glyph: "0", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit1"], glyph: "1", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit2"], glyph: "2", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit3"], glyph: "3", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit4"], glyph: "4", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit5"], glyph: "5", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit6"], glyph: "6", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit7"], glyph: "7", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit8"], glyph: "8", type: "NUMBER", behavior: "APPEND" },
  { code: ["Digit9"], glyph: "9", type: "NUMBER", behavior: "APPEND" },

  // 'PUNCTUATION'
  { code: ["Comma"], glyph: ",", type: "PUNCTUATION", behavior: "APPEND" },
  { code: ["Period"], glyph: ".", type: "PUNCTUATION", behavior: "APPEND" },
  { code: ["Digit1"], glyph: "!", type: "PUNCTUATION", behavior: "APPEND" },
  { code: ["Slash"], glyph: "?", type: "PUNCTUATION", behavior: "APPEND" },
  { code: ["Semicolon"], glyph: ";", type: "PUNCTUATION", behavior: "APPEND" },
  { code: ["Semicolon"], glyph: ":", type: "PUNCTUATION", behavior: "APPEND" },
  { code: ["Quote", "KeyS"], glyph: "'s", type: "PUNCTUATION", behavior: "APPEND" },
  { code: ["Quote"], glyph: "'", type: "PUNCTUATION", behavior: "SPLIT" },
  { code: ["Minus"], glyph: "-", type: "PUNCTUATION", behavior: "SPLIT" },
  {
    code: ["Digit9", "Digit0"],
    glyph: "(",
    bracketPair: ")",
    type: "PUNCTUATION",
    behavior: "BRACKET",
  },
  { code: ["Quote"], glyph: "'", type: "PUNCTUATION", behavior: "BRACKET" },
  { code: ["Quote"], glyph: '"', type: "PUNCTUATION", behavior: "BRACKET" },
  // SPECIALS
  { code: ["Digit2"], glyph: "@", type: "SPECIAL", behavior: "SPLIT" },
  { code: ["Digit3"], glyph: "#", type: "SPECIAL", behavior: "PREPEND" },
  { code: ["Digit4"], glyph: "$", type: "SPECIAL", behavior: "APPEND" },
  { code: ["Digit5"], glyph: "%", type: "SPECIAL", behavior: "APPEND" },
  { code: ["Digit6"], glyph: "^", type: "SPECIAL", behavior: "OPERATOR" },
  { code: ["Digit7"], glyph: "&", type: "SPECIAL", behavior: "OPERATOR" },
  { code: ["Digit8"], glyph: "*", type: "SPECIAL", behavior: "APPEND" },
  { code: ["Slash"], glyph: "/", type: "SPECIAL", behavior: "SPLIT" },
  { code: ["Backquote"], glyph: "~", type: "SPECIAL", behavior: "PREPEND" },
  { code: ["Backquote"], glyph: "`", type: "SPECIAL", behavior: "BRACKET" },
  { code: ["Backslash"], glyph: "\\", type: "SPECIAL", behavior: "PREPEND" },
  { code: ["BracketLeft", "BracketRight"], glyph: "[", bracketPair: "]", type: "SPECIAL", behavior: "BRACKET" },
  { code: ["BracketLeft", "BracketRight"], glyph: "{", bracketPair: "}", type: "SPECIAL", behavior: "BRACKET" },
  { code: ["Comma", "Period"], glyph: "<", bracketPair: ">", type: "SPECIAL", behavior: "BRACKET" },
  { code: ["Minus"], glyph: "_", type: "SPECIAL", behavior: "SPLIT" },
  { code: ["Equal"], glyph: "=", type: "SPECIAL", behavior: "OPERATOR" },
  { code: ["Equal"], glyph: "+", type: "SPECIAL", behavior: "OPERATOR" },
  /* 
    /// PROGRAMMING CHARACTERS
    { code: ["Backquote"], glyph: "`", type: PROGRAMMING, behavior: 'BRACKET' },
    { code: ["BracketLeft", "BracketRight"], glyph: "[", bracketPair: "]", type: PROGRAMMING, behavior: 'BRACKET' },
    { code: ["BracketLeft", "BracketRight"], glyph: "{", bracketPair: "}", type: PROGRAMMING, behavior: 'BRACKET' },
    { code: ["Slash"], glyph: "/", type: PROGRAMMING, behavior: 'SPLIT' },
    { code: ["Backslash"], glyph: "\\", type: PROGRAMMING, behavior: 'PREPEND' },
    { code: ["Comma", "Period"], glyph: "<", bracketPair: ">", type: PROGRAMMING, behavior: 'BRACKET' },
    { code: ["Minus"], glyph: "_", type: PROGRAMMING, behavior: 'SPLIT' },
    { code: ["Minus"], glyph: "-", type: PROGRAMMING, behavior: 'OPERATOR' },
    { code: ["Equal"], glyph: "+", type: PROGRAMMING, behavior: 'OPERATOR' },
    { code: ["Digit8"], glyph: "*", type: PROGRAMMING, behavior: 'OPERATOR' },
    { code: ["Equal"], glyph: "=", type: PROGRAMMING, behavior: 'OPERATOR' },
    { code: ["Digit1","Equal"], glyph: "!=", type: PROGRAMMING, behavior: 'OPERATOR' },
    { code: ["Equal"], glyph: "==", type: PROGRAMMING, behavior: 'OPERATOR' },
    { code: ["Equal"], glyph: "++", type: PROGRAMMING, behavior: 'PREPEND'_OR_'APPEND' },
    { code: ["Comma","Period"], glyph: "<=", type: PROGRAMMING, behavior: 'OPERATOR' },
    { code: ["Comma","Period"], glyph: ">=", type: PROGRAMMING, behavior: 'OPERATOR' },
    { code: ["Digit5"], glyph: "%", type: PROGRAMMING, behavior: 'OPERATOR' } */
])

const vowels = ["a", "e", "i", "o", "u"] // TODO switch to KeyCode[]

const English = new Language(characterSet, vowels, dictionary)

export default English
