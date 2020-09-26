import React from 'react'
import Keyboard from '../Keyboard/Keyboard'
import { render, screen } from '../../utils/test-utils'
import CharSet from '../../utils/CharSet'
import { QWERTY_CharSet } from '../../assets/Layouts/en_US'
import { Finger } from '../../utils/PhysicalKeyboard'

const charSet = new CharSet(QWERTY_CharSet)

describe('Keyboard', () => {
  it('renders without crashing', () => {
    const filteredCharSet = charSet.charSetAtTrainingLevel([Finger.INDEX, Finger.MIDDLE, Finger.RING, Finger.PINKY])
    const active = filteredCharSet.uniqueKeyCodes
    render(<Keyboard fullCharSet={charSet.fullCharSet} pressed={new Set()} active={active} current={"KeyG"} />, {})
    expect(screen.getByText(/Z/)).toBeInTheDocument()
  })
  it ('renders keys with the appropriate classes', () => {
    const filteredCharSet = charSet.charSetAtTrainingLevel([Finger.INDEX, Finger.MIDDLE])
    const active = filteredCharSet.uniqueKeyCodes
    render(<Keyboard fullCharSet={charSet.fullCharSet} pressed={new Set(['KeyT'])} active={active} current={"KeyG"} />, {})
    expect(screen.getByTestId("KeyG")).toHaveClass('highlight')
    expect(screen.getByTestId("KeyP")).toHaveClass('greyed')
    expect(screen.getByTestId("KeyT")).toHaveClass('pressed')
    expect(screen.getByTestId("KeyH")).not.toHaveClass('greyed')
    expect(screen.getByTestId("KeyH")).not.toHaveClass('pressed')
    expect(screen.getByTestId("KeyH")).not.toHaveClass('highlight')
  })
})