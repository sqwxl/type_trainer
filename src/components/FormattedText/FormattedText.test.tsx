import React from 'react'
import { render, screen } from "../../utils/test-utils"
import { FormattedText } from "./FormattedText"

const props = {
  trainingString: "My little pony",
  cursor: 8,
  mistakeCharIndices: new Set([0, 3]),
  greyed: false,
}


describe("FormattedText", () => {
  it("renders a string", () => {
    render(<FormattedText {...props} />, {})
    expect(screen.getByTestId('formattedString')).toHaveTextContent('pony')
  })
  it("swaps spaces for blank placeholder+invisble breaking space", () => {
    render(<FormattedText {...props} />, {})
    expect(screen.getByTestId('formattedString')).not.toHaveTextContent(/\s/g)
    expect(screen.getByTestId('formattedString')).toHaveTextContent("␣​")//blank + invisible space
  })
})
