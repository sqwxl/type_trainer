import React, { useContext } from 'react'
import Keyboard from './Keyboard'
import { themes } from '../Contexts/ThemeContext/ThemeContext'
import { render, fireEvent, screen } from '../../utils/test-utils'


describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<Keyboard />, {})
    expect(screen.getByText('Z')).toBeInTheDocument()
  })
  it('changes appearance when "pressed"', () => {
    render(<Keyboard />, {})
    expect(screen.getByText('Z')).toHaveStyle("background-color: " + themes.light["--color-tertiary"])
  })
  it.todo('changes appearance on theme change')
  it.todo('displays the selected key layout')
})