import React, { useState } from "react"
import { Button, FormCheck, Modal } from "react-bootstrap"
import { Course } from "../../../assets/courses/Courses"
import Keyboard from "../../../core/Keyboard"
import { Language } from "../../../core/Language"
import TrainingText from "../../../core/TrainingText"
import { setNestedProp } from "../../../utils/utils"
import { CodeLanguage, TrainingMode } from "../../defaultState"

interface MyProps {
  onHide: () => void
  show: boolean
  settings: any
  onSubmitChanges: (updatedOptions: any) => void
}

const SettingsModal: React.FC<MyProps> = props => {
  let [draftSettings, setDraftSettings] = useState({...props.settings})

   const sanitizedText = (raw: string): string => {
    return new TrainingText(raw, props.settings.language).text
  }

  const handleChange = (prop: string, value: any) => {
    setDraftSettings((prev: any) => ({...prev, [prop]: value}))
  }

  let form: JSX.Element = <></> // = options.parseForm(handleChange)

  switch (props.settings.trainingMode) {
    case TrainingMode.GUIDED:
      form = (
        <form>
          <label>
            Word length:
            <input type='number' value={draftSettings.guidedWordLength} onChange={e => handleChange('guidedWordLength', e.target.value)} />
          </label>
        </form>
      )
      break
    case TrainingMode.PRACTICE:
      form = (
        <form>
          <label htmlFor='userTextInput'>
            Source Text:
          </label>
          <textarea
            id="userTextInput"
            name="sourceText"
            style={{ width: "100%", height: "400px" }}
            onChange={e => handleChange('practiceSourceText', sanitizedText(e.target.value))}
            value={draftSettings.practiceSourceText}
          />
        </form>
      )
      break
  }

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>{form}</Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {props.onHide();props.onSubmitChanges(draftSettings)}}>Done</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SettingsModal
