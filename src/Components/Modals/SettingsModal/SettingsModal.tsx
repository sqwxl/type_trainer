import React from "react"
import { Button, Modal } from "react-bootstrap"
import StringOptionsForm from "../../Toolbar/StringOptionsForm"
import { TrainingStringOptions } from "../../TypeTrainer"

export default function SettingsModal(props: {
  onHide: () => void
  show: boolean
  trainingStringOptions: TrainingStringOptions
  updateFn: (updatedOptions: TrainingStringOptions) => void
}): JSX.Element {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StringOptionsForm
          key={"optionsForm"}
          trainingStringOptions={props.trainingStringOptions}
          updateFn={(updatedOptions: TrainingStringOptions): void => props.updateFn(updatedOptions)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.onHide()}>Done</Button>
      </Modal.Footer>
    </Modal>
  )
}
