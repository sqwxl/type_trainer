import React from "react"
import { Form, FormCheck, FormControl, FormLabel } from "react-bootstrap"
import styled from "styled-components"
import { CodeModeStringOptions, defaultGuidedModeStringOptions, GuidedModeStringOptions, PracticeModeStringOptions, StringOptions, WordModifierOptions } from "../TypeTrainer"
// import Range from './Range.tsx'

const StyledFormCheck = styled(FormCheck)`
  margin: 0 0.5rem;
`
const labels: { [key: string]: string } = {
  letters: "a",
  caps: "A",
  punct: "Punctuation",
  syms: "Symbols",
  prog: "</>",
  nums: "0-9",
  spaces: "␣​",
}
export default function StringOptionsForm(props: {
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
    console.log("Got: ", target)
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
  let jsx: JSX.Element
  if (isGuideModeStringOptions(props.stringOptions)) {
    const stringOptions = props.stringOptions as GuidedModeStringOptions
    jsx = (
      <Form inline>
        <StyledFormCheck
          key={"cb-letters"}
          type="checkbox"
          label={labels.letters}
          inline
          name={"letters"}
          checked={stringOptions.letters}
          onClick={handleClick}
        ></StyledFormCheck>
        <StyledFormCheck
          key={"cb-spaces"}
          type="checkbox"
          label={labels.spaces}
          inline
          name={"spaces"}
          checked={stringOptions.spaces}
          onClick={handleClick}
        ></StyledFormCheck>
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

        {/* <FormLabel htmlFor="wordLengthRangeSelector">Word length: </FormLabel>
        <Range></Range> */}
      </Form>
    ) 
  } else if (isPracticeModeStringOptions(props.stringOptions)) {
    jsx = (<></>) // TODO
  } else if (isCodeModeStringOptions(props.stringOptions)) {
    jsx = (<></>) // TODO
  }
    return jsx
}

function isGuideModeStringOptions(options: any): options is GuidedModeStringOptions {
  if (Object.keys(defaultGuidedModeStringOptions).every((key) => options[key] != null)) return true
  return false
}

function isPracticeModeStringOptions(options: any): options is PracticeModeStringOptions {
  if (Object.keys(defaultGuidedModeStringOptions).every((key) => options[key] != null)) return true
  return false
}

function isCodeModeStringOptions(options: any): options is CodeModeStringOptions {
  if (Object.keys(defaultGuidedModeStringOptions).every((key) => options[key] != null)) return true
  return false
}