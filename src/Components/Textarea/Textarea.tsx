import React from 'react';
import './Textarea.css'

export interface TextareaProps { 
  displayText: string;
}

export function Textarea(props: TextareaProps) {
  return (
    <div>
      <textarea ></textarea>
    </div>
  )
}