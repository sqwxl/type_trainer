import {CSSProperties} from 'react'


// module augmentation to allow for custom css variables
export interface CSSCustomProperties extends CSSProperties<string | number> {
  [index: string]: any
}