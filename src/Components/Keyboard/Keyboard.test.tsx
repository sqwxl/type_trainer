import React, { useContext } from 'react'
import Keyboard from './Keyboard'
import { themes } from '../Contexts/ThemeContext/ThemeContext'
import { render, fireEvent, screen } from '../../utils/test-utils'
import { TrainingLevels } from '../../utils/models'


describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<Keyboard pressed={new Set()} keyZones={TrainingLevels[0]}/>, {})
    expect(screen.getByText('Z')).toBeInTheDocument()
  })
})