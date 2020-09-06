import React from "react"
import { Form, FormCheck, FormControl, FormLabel } from "react-bootstrap"
import styled from "styled-components"

const StyledFormCheck = styled(FormCheck)`
  margin: 0 0.5rem;
`
const labels: { [key: string]: string } = {
  letters: 'a',
  caps: 'A',
  punct: '?!',
  syms: '</>',
  nums: '9',
  spaces: '␣​'
}
export default function CharacterCheckboxForm(props: { sessionSettings: any; updateFn: (s: any) => void }) {
  function handleChange(e: React.ChangeEvent) {
    if (e.target == null) return
    const target = e.target as HTMLInputElement
    let sessionSettings = { ...props.sessionSettings }
    if (sessionSettings[target.name]) {
      sessionSettings[target.name] = target.value
    } else {
      sessionSettings.characters[target.name] = !sessionSettings.characters[target.name]
    }
    props.updateFn(sessionSettings)
  }

  return (
    <Form inline>
      {Object.keys(props.sessionSettings.characters).map((characterType: string, index: number) => (
        <StyledFormCheck
          type="checkbox"
          label={labels[characterType]}
          inline
          name={characterType}
          checked={props.sessionSettings.characters[characterType]}
          onChange={handleChange}
        ></StyledFormCheck>
      ))}
      <FormLabel htmlFor="lengthSelector">Length: </FormLabel>
      <FormControl
        id="lengthSelector"
        type="number"
        size="sm"
        name="wordsPerString"
        style={{width:"4rem", fontFamily: "'Courier New', Courier, monospace"}}
        defaultValue={props.sessionSettings.wordsPerString}
        onChange={handleChange}
      ></FormControl>
    </Form>
  )
}
