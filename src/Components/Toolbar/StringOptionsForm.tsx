import React from "react"
import { Form, FormCheck, FormControl, FormLabel } from "react-bootstrap"
import styled from "styled-components"
import { TrainingStringOptions, WordModifierOptions } from "../TypeTrainer"
// import Range from './Range.tsx'

const StyledFormCheck = styled(FormCheck)`
  margin: 0 0.5rem;
`
const labels: { [key: string]: string } = {
  letters: 'a',
  caps: 'A',
  punct: 'Punctuation',
  syms: '</>',
  nums: '0-9',
  spaces: '␣​'
}
export default function StringOptionsForm(props: { trainingStringOptions: TrainingStringOptions; updateFn: (updatedOptions: TrainingStringOptions) => void }): JSX.Element {

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
    const options = { ...props.trainingStringOptions }
    console.log("Got: ", target)
    setOption(options, target.name, target.value)
    props.updateFn(options)
  }

  function handleClick(e: React.MouseEvent): void {
    if (e.target == null) return
    const target = e.target as HTMLInputElement
    const options = { ...props.trainingStringOptions }
    console.log(target.name)
    setOption(options, target.name, target.checked)
    props.updateFn(options)
  }

  return (
    <Form inline>
      <StyledFormCheck
        key={"cb-letters"}
        type="checkbox"
        label={labels.letters}
        inline
        name={'letters'}
        checked={props.trainingStringOptions.letters}
        onClick={handleClick}
      ></StyledFormCheck>
      <StyledFormCheck
        key={"cb-spaces"}
        type="checkbox"
        label={labels.spaces}
        inline
        name={'spaces'}
        checked={props.trainingStringOptions.spaces}
        onClick={handleClick}
      ></StyledFormCheck>
      {Object.keys(props.trainingStringOptions.wordModifierOptions).map((wordModifierOption: string, index: number) => (
        <StyledFormCheck
          key={"cb-" + index}
          type="checkbox"
          label={labels[wordModifierOption]}
          inline
          name={wordModifierOption}
          checked={props.trainingStringOptions.wordModifierOptions[wordModifierOption as keyof WordModifierOptions]}
          onClick={handleClick}
        ></StyledFormCheck>
      ))}
      <FormLabel htmlFor="wordsPerStringSelector">Words per sentence:  </FormLabel>
      <FormControl
        id="wordsPerStringSelector"
        key="wps-select"
        type="number"
        size="sm"
        name="wordsPerString"
        style={{width:"4rem", fontFamily: "'Courier New', Courier, monospace"}}
        defaultValue={props.trainingStringOptions.wordsPerString}
        onChange={handleChange}
      ></FormControl>

      {/* <FormLabel htmlFor="wordLengthRangeSelector">Word length: </FormLabel>
      <Range></Range> */}
    </Form>
  )
}
