import { createContext } from 'react'
import { layouts } from './layouts'

export const LayoutContext = createContext(layouts.enUS_linux)

export { layouts } from './layouts'