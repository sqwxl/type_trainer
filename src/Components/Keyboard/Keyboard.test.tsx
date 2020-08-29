import React from 'react'
import Keyboard from './Keyboard'
import App from '../../App'
import { render, fireEvent, screen } from '../../utils/test-utils'

describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<Keyboard pressed={[]} />, {})
  })
  it('has default theme class (light)', () => {
    render(<Keyboard pressed={[]}/>, {})
    expect(screen.getByTestId('keyboard')).toHaveClass('theme-light')
  })
  it('reflects user input', () => {
    render(<App />, {})
    fireEvent(document, new KeyboardEvent('keydown', { code: "KeyZ" }))
    expect(screen.getByText('Z')).toHaveClass('pressed')
    fireEvent(document, new KeyboardEvent('keyup', { code: 'KeyZ' }))
    expect(screen.getByText('Z')).toHaveClass('pressed')
  })
  it.todo('also highlights multiple keys')
  it.todo('changes appearance on theme change')
  it.todo('displays the selected key layout')
})