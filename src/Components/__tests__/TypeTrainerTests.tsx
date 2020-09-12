import React, { useContext } from 'react'
import { TypeTrainer } from '../TypeTrainer'
import { render, fireEvent, screen } from '../../utils/test-utils'
import { MockTrainingStringGenerator } from '../../utils/TrainingStringGenerator'


describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<TypeTrainer generator={new MockTrainingStringGenerator("bla")}/>, {})
  })
})