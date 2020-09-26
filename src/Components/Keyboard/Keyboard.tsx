import "./Keyboard.css"
import * as PhysicalKB from "../../utils/PhysicalKeyboard"
import * as KB from "../../utils/kb_types"
import { QWERTY_labels } from "../../assets/Layouts/en_US"
import React from "react"


type KeyboardObject = {
  code: KB.KeyCode
  labels: KB.KeyLabel
  fingerHand: { hand: PhysicalKB.Hand, finger: PhysicalKB.Finger }
}[][]

/* export interface VitrualKeyboardInterface {
  private _KeyboardObject: KeyboardObject
  loadLayout(physicalLayout:  KB.KeyboardPhysicalLayout, fingerMap: KB.KeyboardFingerMap, labels: KB.KeyboardKeyLabels): KeyboardObject
  //get KeyboardObject(): KeyboardObject
} */

export class VitrualKeyboard {
  private _KeyboardObject: KeyboardObject
  constructor() {
    this._KeyboardObject = this.loadLayout()
  }
  loadLayout(
    physicalLayout: PhysicalKB.KeyboardPhysicalLayout = PhysicalKB.Layout,
    fingerMap: PhysicalKB.KeyboardFingerMap = PhysicalKB.FingerMap,
    labels: KB.KeyboardVisualLayout = QWERTY_labels
  ) {
    let obj: KeyboardObject = []
    for (let [idx, rowCodes] of physicalLayout.entries()) {
      obj[idx] = []
      for (let [col, code] of rowCodes.entries()) {
        obj[idx][col] = {
          code: code,
          labels: labels[code],
          fingerHand: fingerMap[code],
        }
      }
    }
    return obj
  }
  get KeyboardObject(): KeyboardObject {
    return this._KeyboardObject
  }
}

const VKB = new VitrualKeyboard()

export default function Keyboard(props: { fullCharSet: KB.CharacterSet, pressed: Set<string>; active: KB.KeyCode[]; current: KB.KeyCode; }): JSX.Element {
  // const { keyLabels } = useContext(KeyboardLayoutContext)

  const scaffold = VKB.KeyboardObject

  return (
    <div className={"keyboard"} id="keyboard" data-testid="keyboard">
      {scaffold.map((row, rowIdx) => (
        <ul key={"row-" + rowIdx} className={"keyboard-flex-row row-" + rowIdx}>
          {row.map(keyBtn => {
            // Determine style classes to apply to each btn
            let classes = []

            classes.push("row-item-" + rowIdx)
            // Pressed keys
            const keyIsPressed = props.pressed.size && props.pressed.has(keyBtn.code)
            if (keyIsPressed) classes.push("pressed")
            // Active/inactive
            const keyIsActive = props.active.includes(keyBtn.code)
            if (!keyIsActive) classes.push("greyed")
            // Current
            const keyIsCurrent = props.current === keyBtn.code
            if (keyIsCurrent) classes.push("highlight")

            // Generate label html
            let labelHtml: JSX.Element = generateLabelHtml(keyBtn)

            return (
              <li id={keyBtn.code} data-testid={keyBtn.code} key={keyBtn.code} className={classes.join(" ")}>
                {labelHtml}
              </li>
            )
          })}
        </ul>
      ))}
    </div>
  )


  function generateLabelHtml({ labels }: { labels: KB.KeyLabel }) {
    let label: JSX.Element
    switch (Object.keys(labels).length) {
      case 1:
        label = <p>{labels.main}</p>
        break
      case 2:
        label = (
          <p>
            {labels.shift}
            <br />
            {labels.main}
          </p>
        )
        break
      case 3:
        label = (
          <p>
            {labels.shift}
            <br />
            {labels.main} {labels.opt}
          </p>
        )
        break
      default:
        label = <p></p>
        break
    }
    return label
  }
  /* 
    let row: JSX.Element[] = []
    keyRow.forEach(keyBtnData => {
      let label: {
        __html: string
      }
      if (keyBtnData.label) {
        label = { __html: keyBtnData.label }
      } else {
        label = { __html: keyBtnData.key }
      }
      let classes = ["key-btn"]
      classes.push("row-item-" + idx)
      if (pressed.size && pressed.has(keyBtnData.code))
        classes.push("pressed")
      if (!keyBtnData.finger || props.keyZones.every(keyZone => keyZone as string !== keyBtnData.finger))
        classes.push("greyed")
      // if (keyBtnData.class) classes.push(...keyBtnData.class)
      row.push(
        <li
          id={keyBtnData.code}
          key={keyBtnData.code}
          className={classes.join(" ")}
          dangerouslySetInnerHTML={label}
        ></li>
      )
    })
    keys.push(
      <ul key={"row-" + idx} className={"keyboard-flex-row row-" + idx}>
        {row}
      </ul>
    )
  }
  return (
    <div className={"keyboard"} id="keyboard" data-testid="keyboard">
      {keys}
    </div>
    ) 
    */
}
