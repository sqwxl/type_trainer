import React from 'react'
import { render, fireEvent, screen } from '../../utils/test-utils'
import Toolbar from './Toolbar'

describe('toolbar', () => {
  it('renders without crashing', () => {
    render(<Toolbar />, {})
  })
  
  it('has a button that toggles color theme', () => {
    render(<Toolbar />, {})
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })
})