import React from "react"
import { Button, Modal } from "react-bootstrap"
import StringOptionsForm from "./StringOptionsForm"
import { StringOptions, TrainingMode } from "../../TypeTrainer"

export default function SettingsModal(props: {
  onHide: () => void
  show: boolean
  mode: TrainingMode
  trainingStringOptions: StringOptions
  updateFn: (updatedOptions: StringOptions) => void
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
          updateFn={(updatedOptions: StringOptions): void => props.updateFn(updatedOptions)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.onHide()}>Done</Button>
      </Modal.Footer>
    </Modal>
  )
}
