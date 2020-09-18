import "./Keyboard.css"
import { StandardFingerMap, StandardPhysicalLayout } from "../../Layouts/StandardPhysicalLayout"
import * as KB from "../../Layouts/layouts"
import { en_US_KeyLabels } from "../../Layouts/en_US"
import React from "react"
// import { FingerZone } from "../../Layouts/layouts"
type KeyboardObject = {
  code: KB.KeyCode
  labels: KB.KeyLabel
  fingerHand: KB.FingerHand
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
    physicalLayout: KB.KeyboardPhysicalLayout = StandardPhysicalLayout,
    fingerMap: KB.KeyboardFingerMap = StandardFingerMap,
    labels: KB.KeyboardKeyLabels = en_US_KeyLabels
  ) {
    let obj: KeyboardObject = []
    for (let [row, keyCodes] of Object.entries(physicalLayout)) {
      let rowIdx = parseInt(row)
      obj[rowIdx] = []
      for (let [col, code] of keyCodes.entries()) {
        obj[rowIdx][col] = {
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

export default function Keyboard(props: { pressed: Set<string>; keyZones: KB.Finger[] }): JSX.Element {
  // const { keyLabels } = useContext(KeyboardLayoutContext)

  const scaffold = VKB.KeyboardObject
  let pressed = props.pressed
  return (
    <div className={"keyboard"} id="keyboard" data-testid="keyboard">
      {scaffold.map((row, rowIdx) => (
        <ul key={"row-" + rowIdx} className={"keyboard-flex-row row-" + rowIdx}>
          {row.map(keyBtn => {
            // Determine style classes to apply to each btn
            let classes = []
            classes.push("row-item-" + rowIdx)
            if (pressed.size && pressed.has(keyBtn.code)) classes.push("pressed")
            if (props.keyZones.every(keyZone => (keyZone as string) !== keyBtn.fingerHand.finger))
              classes.push("greyed")

            // Generate label html
            let labelHtml: JSX.Element = generateLabelHtml(keyBtn)

            return (
              <li id={keyBtn.code} key={keyBtn.code} className={classes.join(" ")}>
                {labelHtml}
              </li>
            )
          })}
        </ul>
      ))}
    </div>
  )


  function generateLabelHtml(keyBtn: { code: KB.KeyCode; labels: KB.KeyLabel; fingerHand: KB.FingerHand }) {
    let label: JSX.Element
    switch (Object.keys(keyBtn.labels).length) {
      case 1:
        label = <p>{keyBtn.labels.main}</p>
        break
      case 2:
        label = (
          <p>
            {keyBtn.labels.shift}
            <br />
            {keyBtn.labels.main}
          </p>
        )
        break
      case 3:
        label = (
          <p>
            {keyBtn.labels.shift}
            <br />
            {keyBtn.labels.main} {keyBtn.labels.opt}
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
