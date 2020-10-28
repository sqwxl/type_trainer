export function isChar(code: string) {
  if (code.slice(0, 3) === "Key")
    return true;
  if (code.slice(0, 5) === "Digit")
    return true;
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
    case 'Enter':
      return true;
    default:
      return false;
  }
}
