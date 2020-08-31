import React from 'react'
import { TextDisplay } from './TextDisplay'
import { render, screen } from '../../utils/test-utils'

// 'should render'
describe('TrainerDisplayArea', () => {
  it('renders without crashing', () => {
    render(<TextDisplay displayText="" />, {})
  })
  it('displays a string', () => {
    render(<TextDisplay displayText="teststring" />, {})
    expect(screen.getByRole("textbox")).toHaveValue("teststring")
  })
  it.todo('highlights the current character')
  it.todo('marks errors in red')
})