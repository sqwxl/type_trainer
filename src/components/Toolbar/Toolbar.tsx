import React from "react"
import './Toolbar.css'

export default function Toolbar(props: { stats: JSX.Element, buttons: JSX.Element }): JSX.Element {
  return (
    <nav className="toolbar">
      <div key="stats" className='stats'>{props.stats}</div>
      <div key="buttons" className='settingsBtnGrp'>{props.buttons}</div>
    </nav>
  )
}
