import React from 'react';
import Container from 'react-bootstrap/Container'
import './TrainerDisplayArea.css'

export interface TextDisplayProps { 
  displayText: string;
}

export function TextDisplay(props: TextDisplayProps) {
  return (
    <Container>
      <textarea autoFocus readOnly value={"test string"}></textarea>
    </Container>
  )
}