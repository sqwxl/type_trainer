import React from "react"
import { mockKeyCapLabelMap } from "../../utils/mockValues"
import Keyboard from "../../core/Keyboard"
import VirtualKeyboard from "./VirtualKeyboard"
import { render, screen } from "@testing-library/react"

const keyboard = new Keyboard(mockKeyCapLabelMap)

describe.skip("Keyboard", () => {
  it("renders without crashing", () => {
    render(<VirtualKeyboard layout={keyboard} pressed={new Set()} active={[]} currentKey={'NONE'} />, {})
    expect(screen.getByText(/Z/)).toBeInTheDocument()
  })
  it.todo("renders keys with the appropriate classes")
})
