import React from 'react'
import './Toolbar.css'

export default function Toolbar(props: any) {
  return (<nav className="toolbar">
    {props.children}
  </nav>)
}