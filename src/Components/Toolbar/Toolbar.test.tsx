/* eslint-disable jest/expect-expect */
import React from 'react'
import { render } from '../../utils/test-utils'
import Toolbar from './Toolbar'

describe('toolbar', () => {
  it('renders without crashing', () => {
  render(<Toolbar stats={<div/>} buttons={<div />} />, {})
  })
})