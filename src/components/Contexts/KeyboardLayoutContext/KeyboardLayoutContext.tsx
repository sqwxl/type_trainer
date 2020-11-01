import { createContext } from 'react'
import enUsQwerty from '../../../assets/keyboard_layouts/en_qwerty'

export const KeyboardLayoutContext = createContext({keyLabels: enUsQwerty.keyCapLabelMap, charset: enUsQwerty.characters})
