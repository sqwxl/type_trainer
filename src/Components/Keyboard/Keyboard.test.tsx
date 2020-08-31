import React, { useContext } from 'react'
import Keyboard from './Keyboard'
import { themes } from '../Contexts/ThemeContext/ThemeContext'
import { render, fireEvent, screen } from '../../utils/test-utils'


describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<Keyboard />, {})
    expect(screen.getByText('Z')).toBeInTheDocument()
  })
})