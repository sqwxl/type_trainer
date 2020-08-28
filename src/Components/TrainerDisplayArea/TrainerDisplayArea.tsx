import React from 'react';
import './TrainerDisplayArea.css'

export interface TrainerDisplayAreaProps { 
  displayText: string;
}

export function TrainerDisplayArea(props: TrainerDisplayAreaProps) {
  return (
    <div>
      <textarea ></textarea>
    </div>
  )
}