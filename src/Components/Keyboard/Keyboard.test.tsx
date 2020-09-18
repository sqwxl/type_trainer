import React, { useContext } from 'react'
import Keyboard from './Keyboard'
import { themes } from '../Contexts/ThemeContext/ThemeContext'
import { render, fireEvent, screen } from '../../utils/test-utils'
import { TrainingLevel } from '../../utils/models'
import { Finger } from '../../Layouts/layouts'


describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<Keyboard pressed={new Set()} keyZones={[Finger.INDEX]}/>, {})
    expect(screen.getByText(/Z/)).toBeInTheDocument()
  })
})