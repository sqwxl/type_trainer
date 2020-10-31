import { createContext } from 'react'
import enUsQwerty from '../../../assets/Layouts/en_US'

export const KeyboardLayoutContext = createContext({keyLabels: enUsQwerty.labels, charset: enUsQwerty.characters})
