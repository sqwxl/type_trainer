import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'

interface KeyBtnData {
  code: string
  key: string
  label?: string
  class?: string[]
}

type KbdLayout = KeyBtnData[][]

const layout_en: KbdLayout = [
  [
    { code: 'Escape', key: 'Escape', label: 'Esc', class: ["w-1"] },
    { code: 'F1', key: 'F1' },
    { code: 'F2', key: 'F2' },
    { code: 'F3', key: 'F3' },
    { code: 'F4', key: 'F4' },
    { code: 'F5', key: 'F5' },
    { code: 'F6', key: 'F6' },
    { code: 'F7', key: 'F7' },
    { code: 'F8', key: 'F8' },
    { code: 'F9', key: 'F9' },
    { code: 'F10', key: 'F10' },
    { code: 'F11', key: 'F11' },
    { code: 'F12', key: 'F12' },
    { code: 'Home', key: 'Home' },
    { code: 'End', key: 'End' },
    { code: 'Insert', key: 'Insert' },
    { code: 'Delete', key: 'Delete', class: ["w-1"] }
  ],
  [
    { code: 'Backquote', key: '` ~', class: ["w-1"] },
    { code: 'Digit1', key: '1 !', class: ["w-1"] },
    { code: 'Digit2', key: '2 @', class: ["w-1"] },
    { code: 'Digit3', key: '3 #', class: ["w-1"] },
    { code: 'Digit4', key: '4 $', class: ["w-1"] },
    { code: 'Digit5', key: '5 %', class: ["w-1"] },
    { code: 'Digit6', key: '6 ^', class: ["w-1"] },
    { code: 'Digit7', key: '7 &', class: ["w-1"] },
    { code: 'Digit8', key: '8 *', class: ["w-1"] },
    { code: 'Digit9', key: '9 (', class: ["w-1"] },
    { code: 'Digit0', key: '0 )', class: ["w-1"] },
    { code: 'Minus', key: '- =', class: ["w-1"] },
    { code: 'Equal', key: '= +', class: ["w-1"] },
    { code: 'Backspace', key: 'Backspace', class: ["w-2"] }
  ],
  [
    { code: 'Tab', key: 'Tab', class: ["w-1-5"] },
    { code: 'KeyQ', key: 'Q', class: ["w-1"] },
    { code: 'KeyW', key: 'W', class: ["w-1"] },
    { code: 'KeyE', key: 'E', class: ["w-1"] },
    { code: 'KeyR', key: 'R', class: ["w-1"] },
    { code: 'KeyT', key: 'T', class: ["w-1"] },
    { code: 'KeyY', key: 'Y', class: ["w-1"] },
    { code: 'KeyU', key: 'U', class: ["w-1"] },
    { code: 'KeyI', key: 'I', class: ["w-1"] },
    { code: 'KeyO', key: 'O', class: ["w-1"] },
    { code: 'KeyP', key: 'P', class: ["w-1"] },
    { code: 'BracketLeft', key: '[ {' },
    { code: 'BracketRight', key: '] }' },
    { code: 'Backslash', key: '\\ |' }
  ],
  [
    { code: 'CapsLock', key: 'CapsLock' },
    { code: 'KeyA', key: 'A' },
    { code: 'KeyS', key: 'S' },
    { code: 'KeyD', key: 'D' },
    { code: 'KeyF', key: 'F' },
    { code: 'KeyG', key: 'G' },
    { code: 'KeyH', key: 'H' },
    { code: 'KeyJ', key: 'J' },
    { code: 'KeyK', key: 'K' },
    { code: 'KeyL', key: 'L' },
    { code: 'Semicolon', key: '; :' },
    { code: 'Quote', key: `' "` },
    { code: 'Enter', key: 'Enter' }
  ],
  [
    { code: 'ShiftLeft', key: 'Shift' },
    { code: 'KeyZ', key: 'Z' },
    { code: 'KeyX', key: 'X' },
    { code: 'KeyC', key: 'C' },
    { code: 'KeyV', key: 'V' },
    { code: 'KeyB', key: 'B' },
    { code: 'KeyN', key: 'N' },
    { code: 'KeyM', key: 'M' },
    { code: 'Comma', key: ', <' },
    { code: 'Period', key: '. >' },
    { code: 'Slash', key: '/ ?' },
    { code: 'ShiftRight', key: 'Shift' }
  ],
  [
    { code: 'WakeUp', key: 'WakeUp', label: 'Fn' },
    { code: 'ControlLeft', key: 'Control', label: 'Ctrl' },
    { code: 'AltLeft', key: 'Alt' },
    { code: 'Space', key: ' ' },
    { code: 'AltRight', key: 'AltGraph', label: 'Alt' },
    { code: 'ControlRight', key: 'Control', label: 'Ctrl' },
    { code: 'PageUp', key: 'PageUp', label: 'PgUp' },
    { code: 'ArrowUp', key: 'ArrowUp', label: '⬆' },
    { code: 'PageDown', key: 'PageDown', label: 'PgDn' }],
  [{ code: 'ArrowLeft', key: 'ArrowLeft', label: '⬅' },
  { code: 'ArrowDown', key: 'ArrowDown', label: '⬇' },
  { code: 'ArrowRight', key: 'ArrowRight', label: '➡' }]
]



function Keyboard(props: { layout: KbdLayout }) {
  let keys: JSX.Element[] = []
  for (let [idx, keyRow] of props.layout.entries()) {
    let row: JSX.Element[] = []
    keyRow.forEach((keyBtnData: KeyBtnData) => {
      let label: string
      if (keyBtnData.label) {
        label = keyBtnData.label
      } else {
        label = keyBtnData.key
      }
      let classes = ["key"]
      classes.push("row-" + idx)
      if (keyBtnData.class)
        classes.push(...keyBtnData.class)
      row.push(<li id={keyBtnData.code} key={keyBtnData.code} className={classes.join(" ")}>{label}</li>)
    });
    keys.push(<ul>{row}<div style={{ clear: "left" }}></div></ul>)
  }
  return (
    <Container>
      <div className="keyboard">
        {keys}
      </div>
    </Container>
  )
}


function App() {
  return (
    <div className="App">
      <Keyboard layout={layout_en} />
    </div>
  );
}

export default App;
