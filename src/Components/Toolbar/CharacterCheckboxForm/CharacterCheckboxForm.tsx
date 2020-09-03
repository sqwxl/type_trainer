import React from 'react'
import { Form, FormCheck } from 'react-bootstrap'
import styled from 'styled-components'

const StyledFormCheck = styled(FormCheck)`
  margin: 0 0.5rem;
  `
export default function CharacterCheckboxForm(props: any) {
  
  function change(setting: string) {
    let characters = {...props.characters}
    characters[setting] = !characters[setting]
    return () => props.updateSettings(characters)
  }
  return (
    <Form style={{ display: "flex"}}>
      <StyledFormCheck
        type="checkbox"
        label="Letters"
        checked={props.characters.letters}
        onChange={change('letters')}
      >
      </StyledFormCheck>
      <StyledFormCheck
        type="checkbox"
        label="Capitals"
        checked={props.characters.caps}
        onChange={change('caps')}
      >
      </StyledFormCheck>
      <StyledFormCheck
        type="checkbox"
        label="Punctuation"
        checked={props.characters.punct}
        onChange={change('punct')}
      >
      </StyledFormCheck>
      <StyledFormCheck
        type="checkbox"
        label="Symbols"
        checked={props.characters.syms}
        onChange={change('syms')}
      >
      </StyledFormCheck>
      <StyledFormCheck
        type="checkbox"
        label="Numbers"
        checked={props.characters.nums}
        onChange={change('nums')}
      >
      </StyledFormCheck>
      <StyledFormCheck
        type="checkbox"
        label="Spaces"
        checked={props.characters.spaces}
        onChange={change('spaces')}
      >
      </StyledFormCheck>
    </Form>
  )
}