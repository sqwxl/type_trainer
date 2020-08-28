
import React from 'react'
import { render } from '@testing-library/react'
import {LayoutContext, layouts} from '../Components/Providers/LayoutProvider/LayoutContext'
import {ThemeContext, themes} from '../Components/Providers/ThemeProvider/ThemeContext'

const AllProviders = ({ children }: any) => {
  return (
    <ThemeContext.Provider value={themes.light}>
      <LayoutContext.Provider value={layouts.enUS_linux}>
        {children}
      </LayoutContext.Provider>
    </ThemeContext.Provider>
  )
}

const customRender = (ui: any, options: any) => render(ui, { wrapper: AllProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }