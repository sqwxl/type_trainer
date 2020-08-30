import React from 'react'
import { CSSCustomProperties } from './css'

const light: CSSCustomProperties = {
  "--color-primary": "#fff",
  "--text-primary": "#0e0e0e",

  "--color-secondary": "#ddd",
  "--color-tertiary": "#eee",

  "--color-accent": "#5e5e5e",
  "--text-accent": "#eee",
  color: "#0e0e0e"
}

const dark: CSSCustomProperties = {
  "--color-primary": "#303030",
  "--text-primary": "#eee",
  
  "--color-secondary": "#444",
  "--color-tertiary": "#555",
  
  "--color-accent": "#eee",
  "--text-accent": "#111",
  color: "#eee"
}

export const themes: { [index: string]: CSSCustomProperties } = {
  light: light,
  dark: dark,
}

export const ThemeContext = React.createContext({
  theme: themes.light,
  toggleTheme: () => { }
})