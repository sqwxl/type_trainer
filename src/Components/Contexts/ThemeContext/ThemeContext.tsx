import React from 'react'

export enum themes {
  light = 'theme-light',
  dark  = 'theme-dark'
}

export const ThemeContext = React.createContext(themes.light)

