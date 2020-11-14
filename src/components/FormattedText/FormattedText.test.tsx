import { render, screen } from '@testing-library/react'
import React from 'react'
import { TrainingMode } from '../defaultState'
import { FormattedText } from "./FormattedText"

const defaultProps = {
  trainingString: "My little pony",
  cursor: 8,
  mistakeCharIndices: new Set([0, 3]),
  greyed: false,
  uiShowWhiteSpaceSymbols: false,
  mode: TrainingMode.PRACTICE
}


describe("FormattedText", () => {
  it("renders a string", () => {
    render(<FormattedText {...defaultProps} />, {})
    expect(screen.getByTestId('formattedString')).toHaveTextContent('pony')
  })
  it("given the options, it should swap spaces for blank placeholder+invisble breaking space", () => {
    render(<FormattedText {...{...defaultProps, uiShowWhiteSpaceSymbols: true}} />, {})
    expect(screen.getByTestId('formattedString')).not.toHaveTextContent(/\s/g)
    expect(screen.getByTestId('formattedString')).toHaveTextContent("␣​")//blank + invisible space
  })
})
