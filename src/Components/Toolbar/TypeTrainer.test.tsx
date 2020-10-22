import React from 'react'
import { TypeTrainer } from '../TypeTrainer'
import { render } from '../../utils/test-utils'

describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<TypeTrainer />, {})
  })
})