import React, { useContext } from 'react'
import { TypeTrainer } from '../TypeTrainer'
import { render, fireEvent, screen } from '../../utils/test-utils'
import { MarkovTrainingStringGenerator } from '../../utils/TrainingStringGenerator/TrainingStringGenerator'
import { dict } from '../../assets/english_words_array.json'

describe('Keyboard', () => {
  it('renders without crashing', () => {
    render(<TypeTrainer generator={new MarkovTrainingStringGenerator(dict)}></TypeTrainer>, {})
  })
})