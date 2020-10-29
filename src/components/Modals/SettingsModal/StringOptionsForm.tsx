import React from "react"
import { Form, FormCheck, FormControl, FormFile, FormGroup, FormLabel } from "react-bootstrap"
import { UserStringOptions, TrainingMode, FormType } from "../../defaultState"
// import Range from './Range.tsx'

export default function StringOptionsForm(props: {
  mode: TrainingMode
  stringOptions: UserStringOptions
  updateFn: (updatedOptions: UserStringOptions) => void
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

  const formElements: JSX.Element[] = []

  ;(function populate(options: UserStringOptions): void {
    let label, section, group
    for (let [key, option] of Object.entries(options)) {
      label = <FormLabel>{option.formLabel + ": "}</FormLabel>
      switch (option.formType) {
        case FormType.Parent:
          section = populate(option.value as UserStringOptions)
          break
        case FormType.Number:
          section = (
            <FormControl
              key={key + "-key"}
              name={key}
              defaultValue={option.value as number}
              onChange={handleChange}
              min={option.min || 1}
              max={option.max}
              step={option.step || 1}
            ></FormControl>
          )
          break
        case FormType.Switch:
          section = (
            <FormCheck
              id={key + "-form"}
              key={key + "-key"}
              name={key}
              type="switch"
              role="switch"
              checked={option.value as boolean}
              onClick={handleClick}
            ></FormCheck>
          )
          break
        case FormType.Select:
          section = (
            <FormControl as="select" custom>
              {option.values!.map((value) => (
                <option>{value}</option>
              ))}
            </FormControl>
          )
          break
        case FormType.Text:
          section = <FormFile custom></FormFile>
          break
      }
      group = <FormGroup controlId={key + "-form"}>{[label, section]}</FormGroup>
    }
    if (group != null) formElements.push(group)
  })(props.stringOptions)

  return <Form>{formElements}</Form>

  /*switch (props.mode) {

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
      return (<></>) */
}
