import React from 'react'
import { render } from './utils/test-utils';
import App from './App'

describe('App', () => {
  test.skip('renders without crashing', () => {
    render(<App />, {})
  })
})

