import React from "react"
import Keyboard from "./Keyboard"
import { render, screen } from "../../utils/test-utils"
import { KeyboardLayout } from "../../core/KeyboardLayout"
import { mockKeyCapLabelMap } from "../../utils/mockValues"

const layout = new KeyboardLayout(mockKeyCapLabelMap)

describe("Keyboard", () => {
  it("renders without crashing", () => {
    render(<Keyboard layout={layout} pressed={new Set()} active={[]} current={'NONE'} />, {})
    expect(screen.getByText(/Z/)).toBeInTheDocument()
  })
  it.todo("renders keys with the appropriate classes", () => {
    })
})
