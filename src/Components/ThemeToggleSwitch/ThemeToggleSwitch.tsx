import React, { useState, useContext } from 'react'
import { ThemeContext, themes } from '../Contexts/ThemeContext/ThemeContext'
import { Form, FormCheck } from 'react-bootstrap'
// import { css, cx } from "emotion";


export default function ThemeToggleSwitch() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return (
    <Form>
      <FormCheck
        type="switch"
        id="custom-switch"
        label="Dark theme"
        role="switch"
        onClick={toggleTheme} 
        checked={theme === themes.dark}
      />
    </Form>
  )
}