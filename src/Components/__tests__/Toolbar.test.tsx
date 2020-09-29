/* eslint-disable jest/expect-expect */
import React from 'react'
import { render } from '../../utils/test-utils'
import Toolbar from '../Toolbar/Toolbar'

describe('toolbar', () => {
  it('renders without crashing', () => {
  render(<Toolbar left={<div/>} right={<div />} />, {})
  })
})