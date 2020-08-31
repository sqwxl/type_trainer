import React from 'react';
import './TextDisplay.css'

export interface TextDisplayProps { 
  displayText: string;
}

export function TextDisplay(props: TextDisplayProps) {
  return (
    <div className="textDisplay" role="textbox">
        <p dangerouslySetInnerHTML={{ __html: props.displayText }}></p>
      </div>
  )
}
// {/* <textarea autoFocus readOnly value={props.displayText}></textarea> */}