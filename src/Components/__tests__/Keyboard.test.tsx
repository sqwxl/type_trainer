import React from 'react'
import Keyboard from '../Keyboard/Keyboard'
import { render, screen } from '../../utils/test-utils'
import LayoutUtil, { CharSet } from '../../utils/LayoutUtil'
import { enUsQwerty } from '../../assets/Layouts/en_US'
import Courses from '../../utils/Courses'

const layout = new LayoutUtil(enUsQwerty)
const course = Courses.guidedCourse


describe('Keyboard', () => {
  it('renders without crashing', () => {
    const filteredCharSet = layout.charSet.charSetAtCourseLevel(course.levels[0])
    const active = CharSet.uniqueKeyCodes(filteredCharSet)
    render(<Keyboard visualKB={layout.visualKB} pressed={new Set()} active={active} current={"KeyG"} />, {})
    expect(screen.getByText(/Z/)).toBeInTheDocument()
  })
  it ('renders keys with the appropriate classes', () => {
    const filteredCharSet = layout.charSet.charSetAtCourseLevel(course.levels[0])
    const active = CharSet.uniqueKeyCodes(filteredCharSet)
    render(<Keyboard visualKB={layout.visualKB} pressed={new Set(['KeyT'])} active={active} current={"KeyG"} />, {})
    expect(screen.getByTestId("KeyG")).toHaveClass('highlight')
    expect(screen.getByTestId("KeyP")).toHaveClass('greyed')
    expect(screen.getByTestId("KeyT")).toHaveClass('pressed')
    expect(screen.getByTestId("KeyG")).not.toHaveClass('greyed')
    expect(screen.getByTestId("KeyH")).not.toHaveClass('pressed')
    expect(screen.getByTestId("KeyH")).not.toHaveClass('highlight')
  })
})