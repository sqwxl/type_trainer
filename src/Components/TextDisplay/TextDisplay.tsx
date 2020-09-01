import React from 'react';
import './TextDisplay.css'

export function TextDisplay(props: any) {
  return (
    <div className="textDisplay" role="textbox">
        {props.children}
      </div>
  )
}
// {/* <textarea autoFocus readOnly value={props.displayText}></textarea> */}