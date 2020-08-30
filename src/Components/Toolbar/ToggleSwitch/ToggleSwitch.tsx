import React, { useState, useContext } from 'react'
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext'
import { Form, FormCheck } from 'react-bootstrap'

export default function ToggleSwitch() {
  return (
    <Form>
      <FormCheck
        type="switch"
        id="custom-switch"
        label="Check this switch"
        role="switch"
      />
    </Form>
  )
}