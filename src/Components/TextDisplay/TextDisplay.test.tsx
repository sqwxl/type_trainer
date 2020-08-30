import React from 'react'
import { TextDisplay } from './TextDisplay'
import { render } from '../../utils/test-utils'

// 'should render'
describe('TrainerDisplayArea', () => {
  it('renders without crashing', () => {
    render(<TextDisplay displayText="" />, {})
  })
  it.todo('displays a training string')
  it.todo('highlights the current character')
  it.todo('marks errors in red')
})