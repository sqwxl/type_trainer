import React from 'react'
import ReactDOM from 'react-dom'
import Keyboard from './Keyboard'
import layout from "./layouts/layout_enUS_linux";

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Keyboard layout={ layout } />, div)
})