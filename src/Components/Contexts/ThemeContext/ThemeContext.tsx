import React from 'react'
import { CSSCustomProperties } from './css'

const light: CSSCustomProperties = {
  "--color-primary": "#fff",
  "--color-secondary": "#eee",
  "--color-tertiary": "#ddd",
  
  "--text-primary": "#0e0e0e",
  "--text-secondary": "#999",

  "--color-accent": "#5e5e5e",
  "--text-accent": "#eee",
  "--text-background-highlight": "#66ffff",
  "--text-color-highlight": "#ffffff",

  "--mistake": "#ff6666",
  "--correct": "#b3ff66",
  color: "var(--text-primary)"
}

const dark: CSSCustomProperties = {
  "--color-primary": "#303030",
  "--color-secondary": "#777",
  "--color-tertiary": "#555",
  
  "--text-primary": "#eee",
  "--text-secondary": "#999",
  
  "--color-accent": "#eee",
  "--text-accent": "#111",
  "--text-background-highlight": "#66ffff",
  "--text-color-highlight": "#ffffff",
  "--mistake": "#ff6666",
  "--correct": "#b3ff66",
  color: "var(--text-primary)"
}

export const themes: { [index: string]: CSSCustomProperties } = {
  light: light,
  dark: dark,
}

export const ThemeContext = React.createContext({
  theme: themes.light,
  toggleTheme: (): void => { /* toggleFn() */ }
})