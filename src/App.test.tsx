import React from 'react';
import ReactDOM from 'react-dom'
import App from './App';

import { fireEvent, render } from "./test-util";

test('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
});

it('registers keypresses', () => {
  
})
