import React from 'react'
import { render, screen } from '@testing-library/react'
import Loader from '.'

describe('Loader', () => {
  it('renders the loader component', () => {
    render(<Loader />)
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
  })
})
