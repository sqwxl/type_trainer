import React from 'react'
import { render, fireEvent } from '../../utils/test-utils'
import { TrainerToolbar } from './Toolbar'
import App from '../../App'

describe('toolbar', () => {
  it('renders without crashing', () => {
    render(<TrainerToolbar />, {})
  })
  
  it('has a button that toggles color theme', () => {
    render(<App />, {})
    
  })
})