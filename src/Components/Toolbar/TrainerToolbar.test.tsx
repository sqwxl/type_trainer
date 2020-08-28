import React from 'react'
import { render, fireEvent } from '../../utils/test-utils'
import { TrainerToolbar } from './TrainerToolbar'

describe('toolbar', () => {
  it('renders without crashing', () => {
    render(<TrainerToolbar />, {})
  })
  it.todo('displays trainer config links')
})