import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import defaultLayout from './Components/Keyboard/layouts/layout_enUS_linux'
import ThemeContext from './Components/ThemeProvider/ThemeContext'

const AllProviders = ({ children: React.ReactNode }) => {
  return (<ThemeContext.Provider theme='light'>
    {children}
  </ThemeContext.Provider>)
}

const customRender = (ui, options) => render(ui, { wrapper: AllProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }