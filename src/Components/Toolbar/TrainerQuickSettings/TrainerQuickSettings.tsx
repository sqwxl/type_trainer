import React from 'react'
import { Form, FormCheck } from 'react-bootstrap'
import styled from 'styled-components'

const StyledFormCheck = styled(FormCheck)`
  margin: 0 0.5rem;
  `
export default function TrainerQuickSettings(props: any) {
  
  function change(setting: string) {
    let settings = {...props.settings}
    settings[setting] = !settings[setting]
    return () => props.updateSettings(settings)
  }
  return (
    <Form style={{ display: "flex"}}>
      <StyledFormCheck
        type="checkbox"
        label="Capitals"
        checked={props.settings.caps}
        onChange={change('caps')}
      >
      </StyledFormCheck>
      <StyledFormCheck
        type="checkbox"
        label="Punctuation"
        checked={props.settings.punct}
        onChange={change('punct')}
      >
      </StyledFormCheck>
      <StyledFormCheck
        type="checkbox"
        label="Numbers & Symbols"
        checked={props.settings.syms}
        onChange={change('syms')}
      >
      </StyledFormCheck>
    </Form>
  )
}