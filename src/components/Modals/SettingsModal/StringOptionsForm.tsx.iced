import React from "react"
import { Form, FormCheck, FormControl, FormFile, FormGroup, FormLabel } from "react-bootstrap"
import { StringGeneratorOptions } from "../../../core/TrainingStringGenerator/StringGeneratorOption"
import { TrainingMode } from "../../defaultState"

interface MyProps {
  mode: TrainingMode
  stringOptions: StringGeneratorOptions
  updatefn: (updatedOptions: StringGeneratorOptions) => void
}

const StringOptionsForm: React.FC<MyProps> = props => {
   function handleChange(e: React.ChangeEvent): void {
    if (e.target == null) return
    const target = e.target as HTMLInputElement
    const options = { ...props.stringOptions }
    options[target.name].setNestedOption(target.name, target.value)
    props.updatefn(options)
  }

  function handleSwitch(setting: string): void {
    const options = { ...props.stringOptions }
    options[setting].setNestedOption(target.name, !target.checked)
    props.updatefn(options)
  }

  function parseOptions(options: StringGeneratorOptions): JSX.Element {
    let formElements: JSX.Element[] = []
    let label,
      section,
      group,
      groupKey = 0
    for (let [key, option] of Object.entries(options)) {
      label = <FormLabel key={key + "-label"}>{option.formLabel + ": "}</FormLabel>
      switch (option.formType) {
        case "PARENT":
          section = parseOptions(option.value as StringGeneratorOptions)
          break
        case "NUMBER":
          section = (
            <FormControl
              type="number"
              key={key + "-key"}
              name={key}
              defaultValue={option.value as number}
              onChange={handleChange}
              min={option.min || 1}
              max={option.max}
              step={option.step || 1}
            />
          )
          break
        case "SWITCH":
          label = <></>
          section = (
            <FormCheck
              type="switch"
              id={key + "-switch"}
              key={key + "-switch"}
              name={key}
              role="switch"
              label={option.formLabel}
              checked={option.value as boolean}
              onChange={() => handleSwitch(key)}
            />
          )
          break
        case "SELECT":
          section = (
            <FormControl as="select" key={key + "-key"} name={key} custom>
              {option.values!.map(value => (
                <option>{value}</option>
              ))}
            </FormControl>
          )
          break
        case "TEXT":
          section = <FormFile id={key + "-file"} />
          break
      }
      group = (
        <FormGroup key={groupKey++} controlId={key + "-form"}>
          {[label, section]}
        </FormGroup>
      )
      formElements.push(group)
    }
    return <Form>{formElements}</Form>
  }

  return parseOptions(props.stringOptions)
}

export default StringOptionsForm
