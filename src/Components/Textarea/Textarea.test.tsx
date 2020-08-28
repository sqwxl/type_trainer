import React from 'react'
import ReactDOM from 'react-dom'
import { Textarea } from './Textarea'

// 'should render'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Textarea />, div)
})

// 'displays text'


// 'accepts user input'

// 'displays user input'