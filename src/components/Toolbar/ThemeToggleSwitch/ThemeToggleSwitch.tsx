import React, { useContext } from 'react'
import { ThemeContext, themes } from '../../Contexts/ThemeContext/ThemeContext'
import { FormCheck } from 'react-bootstrap'


export default function ThemeToggleSwitch() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return (
      <FormCheck
        type="switch"
        id="custom-switch"
        label="Dark"
        role="switch"
        onChange={toggleTheme} 
        checked={theme === themes.dark}
      />
  )
}