import React from 'react'
import Keyboard from './Keyboard'
import { render } from '../../utils/test-utils'

it('renders without crashing', () => {
  render(<Keyboard />, {})
})