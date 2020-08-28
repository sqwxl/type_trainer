import React from 'react'
import { TrainerDisplayArea } from './TrainerDisplayArea'
import { render } from '../../utils/test-utils'

// 'should render'
describe('TrainerDisplayArea', () => {
  it('renders without crashing', () => {
    render(<TrainerDisplayArea displayText="" />, {})
  })
  it.todo('displays a training string')
  it.todo('highlights the current character')
  it.todo('marks errors in red')
})