
import React from 'react'
import { render } from '@testing-library/react'
import {KeyboardLayoutContext} from '../Components/Contexts/KeyboardLayoutContext/KeyboardLayoutContext'
import {ThemeContext, themes} from '../Components/Contexts/ThemeContext/ThemeContext'
import { en_US_CharSet, en_US_KeyLabels } from '../Layouts/en_US'

const AllProviders = ({ children }: any) => {
  return (
    <ThemeContext.Provider value={{ theme: themes.dark, toggleTheme: () => { }}}>
      <KeyboardLayoutContext.Provider value={{keyLabels: en_US_KeyLabels, charset: en_US_CharSet}}>
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