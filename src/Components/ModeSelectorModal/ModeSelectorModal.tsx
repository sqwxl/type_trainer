import React from "react";
import Modal from "react-bootstrap/Modal";
import { TrainingMode } from "../TypeTrainer";

export default function ModeSelectorModal(props: { onHide: () => void, show: boolean, setmode: (mode: TrainingMode) => void}) {
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
        <div onClick={() => props.setmode(TrainingMode.Guided)}>
          Guided: choose this if you are learning to touch type
        </div>
        <div onClick={() => props.setmode(TrainingMode.Practice)}>
          Practice: hone your skills
        </div>
        <div onClick={() => props.setmode(TrainingMode.Code)}>
          Code: for programmers
        </div>
      </Modal.Body>
    </Modal>
  );
}
