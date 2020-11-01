import React from "react"
import { Button, Modal } from "react-bootstrap"
import { StringGeneratorOptions } from "../../../core/TrainingStringGenerator/StringGeneratorOption"
import { TrainingMode } from "../../defaultState"
import StringOptionsForm from "./StringOptionsForm"

export default function SettingsModal(props: {
  onHide: () => void
  show: boolean
  mode: TrainingMode
  trainingStringOptions: StringGeneratorOptions
  updateFn: (updatedOptions: StringGeneratorOptions) => void
}): JSX.Element {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StringOptionsForm
          key={"optionsForm"}
          mode={props.mode}
          stringOptions={props.trainingStringOptions}
          updateFn={(updatedOptions: StringGeneratorOptions): void => props.updateFn(updatedOptions)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.onHide()}>Done</Button>
      </Modal.Footer>
    </Modal>
  )
}
