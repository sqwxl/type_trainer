import React, { useState, useContext } from 'react'
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext'
import { Form, FormCheck } from 'react-bootstrap'
// import { css, cx } from "emotion";


export default function ToggleSwitch() {
  const {toggleTheme} = useContext(ThemeContext)
  return (
    <Form>
      <FormCheck
        type="switch"
        id="custom-switch"
        label="Check this switch"
        role="switch"
        onClick={toggleTheme}
      />
    </Form>
  )
}