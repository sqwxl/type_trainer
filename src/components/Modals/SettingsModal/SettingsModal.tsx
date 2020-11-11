import React, { useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { Course } from "../../../assets/courses/Courses"
import { Language } from "../../../core/Language"
import TrainingText from "../../../core/TrainingText"
import { sanitizeCode } from "../../../utils/text-utils"
import { setNestedProp } from "../../../utils/utils"
import { TrainingMode } from "../../defaultState"

interface MyProps {
  onHide: () => void
  show: boolean
  mode: TrainingMode
  language: Language
  guidedCourse: Course
  guidedLevelIndex: number | undefined
  guidedWordLength: { min: number; max: number }
  guidedNumWords: number
  guidedHasCaps: boolean
  guidedHasPunctuation: boolean
  guidedHasNumbers: boolean
  guidedHasSpecials: boolean
  guidedLikelihoodModified: number

  practiceSourceText: string

  codeSourceText: string
  codeLines: number
  onSubmitChanges: (updatedOptions: any) => void
}

const SettingsModal: React.FC<MyProps> = (props: MyProps) => {
  let [draftSettings, setDraftSettings] = useState({
    guidedCourse: props.guidedCourse,
    guidedLevelIndex: props.guidedLevelIndex,
    guidedWordLength: props.guidedWordLength,
    guidedNumWords: props.guidedNumWords,
    guidedHasCaps: props.guidedHasCaps,
    guidedHasPunctuation: props.guidedHasPunctuation,
    guidedHasNumbers: props.guidedHasNumbers,
    guidedHasSpecials: props.guidedHasSpecials,
    guidedLikelihoodModified: props.guidedLikelihoodModified,
    practiceSourceText: props.practiceSourceText,
    codeSourceText: props.codeSourceText,
    codeLines: props.codeLines,
  })

  const sanitizedText = (raw: string): string => {
    return new TrainingText(raw, props.language).text
  }

  const handleChange = (propPath: string, value: any) => {
    const newSettings = setNestedProp(draftSettings, propPath.split("."), value)
    setDraftSettings((prev: any) => ({ ...prev, ...newSettings }))
  }

  const handleSubmit = (settings: any) => {
    props.onSubmitChanges(settings)
  }

  let form: JSX.Element = <></> // = options.parseForm(handleChange)

  switch (props.mode) {
    case TrainingMode.GUIDED:
      form = (
        <form>
          <div>Word length:</div>
          <div>
            <input
              id="minlength"
              type="number"
              value={draftSettings.guidedWordLength.min}
              onChange={e => handleChange("guidedWordLength.min", e.target.value)}
            />
            <label htmlFor="minlength">min</label>
          </div>
          <div>
            <input
              id="maxlength"
              type="number"
              value={draftSettings.guidedWordLength.max}
              onChange={e => handleChange("guidedWordLength.max", e.target.value)}
            />
            <label htmlFor="maxlength">max</label>
          </div>
          <div>
            <div>
              <label htmlFor="numwords">Words:</label>
            </div>
            <div>
              <input
                id="numwords"
                type="number"
                value={draftSettings.guidedNumWords}
                onChange={e => handleChange("guidedNumWords", e.target.value)}
              />
            </div>
          </div>
          <hr />
          <div>Modifiers:</div>
          <div>
            <input
              id="chkbx-caps"
              type="checkbox"
              checked={draftSettings.guidedHasCaps}
              onChange={e => setDraftSettings({ ...draftSettings, guidedHasCaps: !draftSettings.guidedHasCaps })}
            />
            <label htmlFor="chkbx-caps">aA</label>
          </div>
          <div>
            <input
              id="chkbx-punct"
              type="checkbox"
              checked={draftSettings.guidedHasPunctuation}
              onChange={e =>
                setDraftSettings({ ...draftSettings, guidedHasPunctuation: !draftSettings.guidedHasPunctuation })
              }
            />
            <label htmlFor="chkbx-punct">!?</label>
          </div>
          <div>
            <input
              id="chkbx-nums"
              type="checkbox"
              checked={draftSettings.guidedHasNumbers}
              onChange={e => setDraftSettings({ ...draftSettings, guidedHasNumbers: !draftSettings.guidedHasNumbers })}
            />
            <label htmlFor="chkbx-nums">0-9</label>
          </div>
          <div>
            <input
              id="chkbx-spec"
              type="checkbox"
              checked={draftSettings.guidedHasSpecials}
              onChange={e =>
                setDraftSettings({ ...draftSettings, guidedHasSpecials: !draftSettings.guidedHasSpecials })
              }
            />
            <label htmlFor="chkbx-spec">$</label>
          </div>
        </form>
      )
      break
    case TrainingMode.PRACTICE:
      form = (
        <form>
          <label htmlFor="userTextInput">Source Text:</label>
          <textarea
            id="userTextInput"
            name="sourceText"
            style={{ width: "100%", height: "400px" }}
            onChange={e => handleChange("practiceSourceText", sanitizedText(e.target.value))}
            value={draftSettings.practiceSourceText}
          />
        </form>
      )
      break
    case TrainingMode.CODE:
      form = (
        <form>
          <label htmlFor="userTextInput">Source Text:</label>
          <textarea
            id="userTextInput"
            name="sourceText"
            style={{ width: "100%", height: "400px" }}
            value={draftSettings.codeSourceText}
            onChange={e => handleChange("codeSourceText", sanitizeCode(e.target.value))}
          />
        </form>
      )
  }

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>{form}</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            handleSubmit(draftSettings)
            props.onHide()
          }}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SettingsModal
