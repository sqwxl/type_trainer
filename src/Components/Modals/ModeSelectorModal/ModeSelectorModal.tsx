import React from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { TrainingMode } from "../../TypeTrainer";

export default function ModeSelectorModal(props: { onHide: () => void, show: boolean, setTrainingMode: (mode: TrainingMode) => void}): JSX.Element {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Pick a training mode
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button block={true} onClick={() => {console.log('clicked!');props.setTrainingMode(TrainingMode.Guided)}}>
          <strong>Guided:</strong> choose this if you are learning to touch type
        </Button><br/>
        <Button block={true} onClick={() => props.setTrainingMode(TrainingMode.Practice)}>
          <strong>Practice:</strong> hone your skills
        </Button><br/>
        <Button block={true} onClick={() => props.setTrainingMode(TrainingMode.Code)}>
          <strong>Code:</strong> for programmers
        </Button><br />
      </Modal.Body>
    </Modal>
  );
}
