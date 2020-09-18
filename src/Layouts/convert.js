const en_US_KeyLabels = {
  Escape: ['Esc'],
  F1: ['F1'],
  F2: ['F2'],
  F3: ['F3'],
  F4: ['F4'],
  F5: ['F5'],
  F6: ['F6'],
  F7: ['F7'],
  F8: ['F8'],
  F9: ['F9'],
  F10:['F10'],
  F11:['F11'],
  F12:['F12'],
  Home: ['Home'],
  End: ['End'],
  Insert: ['Insert'],
  Delete: ['Delete'],
  Backquote: ['`','~'],
  Digit1: ['1','!'],
  Digit2: ['2','@'],
  Digit3: ['3','#'],
  Digit4: ['4','$'],
  Digit5: ['5','%'],
  Digit6: ['6','^'],
  Digit7: ['7','&'],
  Digit8: ['8','*'],
  Digit9: ['9','('],
  Digit0: ['0',')'],
  Minus: ['-','_'],
  Equal: ['=','+'],
  Backspace: ['Backspace'],
  Tab: ['Tab'],
  KeyQ: ['q','Q'],
  KeyW: ['w','W'],
  KeyE: ['e','E'],
  KeyR: ['r','R'],
  KeyT: ['t','T'],
  KeyY: ['y','Y'],
  KeyU: ['u','U'],
  KeyI: ['i','I'],
  KeyO: ['o','O'],
  KeyP: ['p','P'],
  BracketLeft: ['[','{'],
  BracketRight: [']','}'],
  Backslash: ['\\','|'],
  CapsLock: ['CapsLock'],
  KeyA: ['a','A'],
  KeyS: ['s','S'],
  KeyD: ['d','D'],
  KeyF: ['f','F'],
  KeyG: ['g','G'],
  KeyH: ['h','H'],
  KeyJ: ['j','J'],
  KeyK: ['k','K'],
  KeyL: ['l','L'],
  Semicolon: [';',':'],
  Quote: ['\'','"'],
  Enter: ['Enter'],
  ShiftLeft: ['Shift'],
  KeyZ: ['z','Z'],
  KeyX: ['x','X'],
  KeyC: ['c','C'],
  KeyV: ['v','V'],
  KeyB: ['b','B'],
  KeyN: ['n','N'],
  KeyM: ['m','M'],
  Comma: [',','<'],
  Period: ['.','>'],
  Slash: ['/','?'],
  ShiftRight: ['Shift'],
  WakeUp: ['Fn'],
  ControlLeft: ['Ctrl'],
  AltLeft: ['Alt'],
  Space: [''],
  AltRight: ['Alt'],
  ControlRight: ['Ctrl'],
  PageUp: ['PgUp'],
  ArrowUp: ['⬆'],
  PageDown: ['PgDn'],
  ArrowLeft: ['⬅'],
  ArrowDown: ['⬇'],
  ArrowRight: ['➡'],
}

let toObj = {...en_US_KeyLabels}
for(let [key, labels] of Object.entries(en_US_KeyLabels)) {
  let o ={}
  for (let [idx, label] of labels.entries()) {
    switch (idx) {
      case 0:
        o.main = label
        break
      case 1:
        o.shift = label
        break
      case 2:
        o.opt = label
        break
      default:
        break
    }
  }
  toObj[key] = {...o}
}
console.log(toObj)