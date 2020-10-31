
import React from 'react'
import { render } from '@testing-library/react'
import {KeyboardLayoutContext} from '../components/Contexts/KeyboardLayoutContext/KeyboardLayoutContext'
import {ThemeContext, themes} from '../components/Contexts/ThemeContext/ThemeContext'
import enUsQwerty from '../assets/Layouts/en_US'

const AllProviders = ({ children }: any) => {
  return (
    <ThemeContext.Provider value={{ theme: themes.dark, toggleTheme: () => { }}}>
      <KeyboardLayoutContext.Provider value={{keyLabels: enUsQwerty.labels, charset: enUsQwerty.characters}}>
        {children}
      </KeyboardLayoutContext.Provider>
    </ThemeContext.Provider>
  )
}

const customRender = (ui: any, options: any) => render(ui, { wrapper: AllProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }