import React from 'react'
import { fireEvent, render, screen } from './utils/test-utils';
import App from './App'

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />, {})
  });
  it.todo('displays all components')
})

