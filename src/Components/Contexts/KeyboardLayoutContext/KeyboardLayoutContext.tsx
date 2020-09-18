import { createContext } from 'react'
import { en_US_KeyLabels, en_US_CharSet } from '../../../Layouts/en_US'

export const KeyboardLayoutContext = createContext({keyLabels: en_US_KeyLabels, charset: en_US_CharSet})
