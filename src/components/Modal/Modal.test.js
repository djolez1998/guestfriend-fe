import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Modal from '.'

describe('Modal Component', () => {
  const handleSubmitMock = jest.fn()
  const handleCloseMock = jest.fn()

  const setup = (modalType = 'todo') => {
    render(
      <Modal
        modalType={modalType}
        onClose={handleCloseMock}
        onSubmit={handleSubmitMock}
      />
    )
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal correctly when modalType is not null', () => {
    setup()

    // Ensure modal content is rendered
    expect(screen.getByText('Add new ticket')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ticket content')).toBeInTheDocument()
    expect(screen.getByText('Add ticket')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', () => {
    setup()

    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)

    // Check if close handler is called
    expect(handleCloseMock).toHaveBeenCalledTimes(1)
  })

  it('submits the form and closes modal', async () => {
    setup()

    // Simulate filling the form and submitting it
    const input = screen.getByPlaceholderText('Ticket content')
    fireEvent.change(input, { target: { value: 'New Ticket' } })

    const submitButton = screen.getByText('Add ticket')
    fireEvent.click(submitButton)

    // Check if the submit handler is called with correct arguments
    await waitFor(() => {
      expect(handleSubmitMock).toHaveBeenCalledWith('New Ticket', 'todo')
    })

    // Check if modal closes after submission
    expect(handleCloseMock).toHaveBeenCalledTimes(1)
  })
})
