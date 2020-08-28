import React from 'react'
import { fireEvent, render } from './utils/test-utils';
import App from './App'


test('renders without crashing', () => {
  render(<App />, {})
});

it('registers keypresses', () => {
  
})
