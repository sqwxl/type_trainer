import React from 'react';
import './TextDisplay.css'

type MyProps = {
  style: React.CSSProperties
}

export function TextDisplay(props: React.PropsWithChildren<MyProps>): JSX.Element {
  return (
    <div className="textDisplay" style={props.style} role="textbox">
      {props.children}
    </div>
  )
}
// {/* <textarea autoFocus readOnly value={props.displayText}></textarea> */}