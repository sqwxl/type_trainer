import React from 'react'
import Keyboard from './Keyboard'
import App from '../../App'
import { render, fireEvent } from '../../utils/test-utils'

describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<Keyboard />, {})
  })
  it.skip('highlights key presses (z)', () => {
    render(<App />, {})
    fireEvent(document, new KeyboardEvent('keydown', { code: "KeyZ" }))
    // check that keyBtn Z gets highlighted on press and reverts on release
    expect(true).toBe(false)
  })
  it.todo('also highlights multiple keys')
  it.todo('changes appearance on theme change')
  it.todo('displays the selected key layout')
})