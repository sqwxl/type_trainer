import { createContext } from 'react'
import { QWERTY_labels, QWERTY_CharSet } from '../../../assets/Layouts/en_US'

export const KeyboardLayoutContext = createContext({keyLabels: QWERTY_labels, charset: QWERTY_CharSet})
