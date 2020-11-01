
import React from 'react'
import { render } from '@testing-library/react'
import {ThemeContext, themes} from '../components/Contexts/ThemeContext/ThemeContext'
import enUsQwerty from '../assets/keyboard_layouts/en_qwerty'

const AllProviders = ({ children }: any) => {
  return (
    <ThemeContext.Provider value={{ theme: themes.dark, toggleTheme: () => { }}}>
        {children}
    </ThemeContext.Provider>
  )
}

const customRender = (ui: any, options: any) => render(ui, { wrapper: AllProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }