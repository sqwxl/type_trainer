import { render } from '@testing-library/react'
import React from 'react'
import Toolbar from './Toolbar'

describe('toolbar', () => {
  it('renders without crashing', () => {
  render(<Toolbar stats={<div key='testkey1' />} buttons={[<div key='testkey2'/>]} />, {})
  })
})