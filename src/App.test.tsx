import React from 'react'
import { fireEvent, render, screen } from './utils/test-utils';
import App from './App'

describe.skip('App', () => {
  test('renders without crashing', () => {
    render(<App />, {})
  });
  it('reflects user input', () => {
    render(<App />, {})
    fireEvent.keyDown(document, { code: "KeyZ" })
    expect(screen.getByText('Z')).toHaveClass('pressed')
    fireEvent.keyUp(document, { code: "KeyZ" })
    expect(screen.getByText('Z')).not.toHaveClass('pressed')
  })
  it('also highlights multiple keys', () => {
    render(<App />, {})
    fireEvent.keyDown(document, { code: "KeyZ" })
    fireEvent.keyDown(document, { code: "KeyP" })
    expect(screen.getByText('Z')).toHaveClass('pressed')
    expect(screen.getByText('P')).toHaveClass('pressed')
    fireEvent.keyUp(document, { code: "KeyZ" })
    fireEvent.keyUp(document, { code: "KeyP" })
    expect(screen.getByText('Z')).not.toHaveClass('pressed')
    expect(screen.getByText('P')).not.toHaveClass('pressed')
  })
  it.todo('displays all components')
})

