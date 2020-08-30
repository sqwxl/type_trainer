import React from 'react'
import Keyboard from './Keyboard'
import App from '../../App'
import { render, fireEvent, screen } from '../../utils/test-utils'

describe('Keyboard', () => {
  it.skip('renders without crashing', () => {
    render(<Keyboard />, {})
  })
  it.skip('has default theme class (light)', () => {
    render(<Keyboard />, {})
    expect(screen.getByTestId('keyboard')).toHaveClass('theme-light')
  })
  it.todo('changes appearance on theme change')
  it.todo('displays the selected key layout')
})