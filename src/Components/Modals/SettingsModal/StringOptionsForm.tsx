import React from "react"
import { Form, FormCheck, FormControl, FormLabel } from "react-bootstrap"
import styled from "styled-components"
import {
  CodeModeStringOptions,
  GuidedModeStringOptions,
  PracticeModeStringOptions,
  StringOptions,
  TrainingMode,
  WordModifierOptions,
} from "../../TypeTrainer"
// import Range from './Range.tsx'

const StyledFormCheck = styled(FormCheck)`
  margin: 0 0.5rem;
`
const labels: { [key: string]: string } = {
  caps: "A",
  punct: "Punctuation",
  syms: "Symbols",
  prog: "</>",
  nums: "0-9",
}
export default function StringOptionsForm(props: {
  mode: TrainingMode
  stringOptions: StringOptions
  updateFn: (updatedOptions: StringOptions) => void
}): JSX.Element {

  function setOption(object: any, property: any, value: string | number | boolean): void {
    if (object[property] != null) {
      console.log(`setting ${property} on ${object} to ${value}`)
      object[property] = value
      return
    }
    for (const prop in object) {
      if (typeof object[prop] === "object") setOption(object[prop], property, value)
    }
  }

  function handleChange(e: React.ChangeEvent): void {
    if (e.target == null) return
    const target = e.target as HTMLInputElement
    const options = { ...props.stringOptions }
    setOption(options, target.name, target.value)
    props.updateFn(options)
  }

  function handleClick(e: React.MouseEvent): void {
    if (e.target == null) return
    const target = e.target as HTMLInputElement
    const options = { ...props.stringOptions }
    console.log(target.name)
    setOption(options, target.name, target.checked)
    props.updateFn(options)
  }
  let stringOptions: any
  switch (props.mode) {
    case TrainingMode.Guided:
      stringOptions = props.stringOptions as GuidedModeStringOptions
      return (
        <Form >
          {Object.keys(stringOptions.wordModifierOptions).map((wordModifierOption: string, index: number) => (
            <StyledFormCheck
              key={"cb-" + index}
              type="checkbox"
              label={labels[wordModifierOption]}
              inline
              name={wordModifierOption}
              checked={stringOptions.wordModifierOptions[wordModifierOption as keyof WordModifierOptions]}
              onClick={handleClick}
            ></StyledFormCheck>
          ))}
          <FormLabel htmlFor="wordsPerStringSelector">Words per sentence: </FormLabel>
          <FormControl
            id="wordsPerStringSelector"
            key="wps-select"
            type="number"
            size="sm"
            name="wordsPerString"
            style={{ width: "4rem", fontFamily: "'Courier New', Courier, monospace" }}
            defaultValue={stringOptions.wordsPerString}
            onChange={handleChange}
          ></FormControl>
        </Form>
      )
    case TrainingMode.Practice:
      stringOptions = props.stringOptions as PracticeModeStringOptions
      return (<></>) // TODO
    case TrainingMode.Code:
      stringOptions = props.stringOptions as CodeModeStringOptions
      return (<></>) // TODO
    default:
      return (<></>)
  }
}