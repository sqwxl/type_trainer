export function isVowel(char: string): boolean {
  const vowels = ["a", "e", "i", "o", "u"]
  return vowels.includes(char)
}

export function isChar(code: string) {
  if (code.slice(0, 3) === "Key") return true
  if (code.slice(0, 5) === "Digit") return true
  switch (code) {
    case "Space":
    case "Backquote":
    case "Minus":
    case "Equal":
    case "BracketLeft":
    case "BracketRight":
    case "Backslash":
    case "Semicolon":
    case "Quote":
    case "Comma":
    case "Period":
    case "Slash":
      return true
    default:
      return false
  }
}

export function Timer() {
  let paused: boolean
  let startMark: number
  let pauseMark: number
  let pausedLength: number
  return {
    start: () => {
      startMark = Date.now()
      paused = false
      pauseMark = 0
      pausedLength = 0
    },
    pause: () => {
      if (!paused) {
        paused = true
        pauseMark = Date.now()
      }
    },
    unPause: () => {
      if (paused) {
        paused = false
        pausedLength += Date.now() - pauseMark
      }
    },
    getTimeElapsed: () => {
      let total = Date.now() - (startMark + pausedLength)
      return total
    },
  }
}
