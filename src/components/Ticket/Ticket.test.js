import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanContext } from '../../context/KanbanContext'
import Ticket from '.'
import { DndProvider } from 'react-dnd'
import { TestBackend } from 'react-dnd-test-backend'

const mockDeleteTicket = jest.fn()
const mockEditTicket = jest.fn()

const renderTicket = (ticketProps) => {
  const contextValue = {
    deleteTicket: mockDeleteTicket,
    editTicket: mockEditTicket
  }

  return render(
    <DndProvider backend={TestBackend}>
      <KanbanContext.Provider value={contextValue}>
        <Ticket {...ticketProps} />
      </KanbanContext.Provider>
    </DndProvider>
  )
}

describe('Ticket Component', () => {
  const ticket = { id: '1', content: 'Test Ticket' }
  const column = 'todo'

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders ticket content', () => {
    renderTicket({ ticket, column })

    expect(screen.getByText('Test Ticket')).toBeInTheDocument()
  })

  test('allows editing the ticket', () => {
    renderTicket({ ticket, column })

    // Simulate double-click to enter editing mode
    fireEvent.doubleClick(screen.getByText('Test Ticket'))

    // Check if the input field is rendered
    const input = screen.getByDisplayValue('Test Ticket')
    expect(input).toBeInTheDocument()

    // Change the input value and simulate blur
    fireEvent.change(input, { target: { value: 'Updated Ticket' } })
    fireEvent.blur(input)

    // Ensure the editTicket function is called with correct parameters
    expect(mockEditTicket).toHaveBeenCalledWith(
      column,
      ticket.id,
      'Updated Ticket'
    )
  })

  test('does not edit if content is unchanged', () => {
    renderTicket({ ticket, column })

    fireEvent.doubleClick(screen.getByText('Test Ticket'))

    const input = screen.getByDisplayValue('Test Ticket')
    fireEvent.blur(input)

    expect(mockEditTicket).not.toHaveBeenCalled()
  })

  test('deletes the ticket', () => {
    renderTicket({ ticket, column })

    // Click the delete button
    fireEvent.click(screen.getByText('x'))

    // Ensure the deleteTicket function is called with correct parameters
    expect(mockDeleteTicket).toHaveBeenCalledWith(column, ticket.id)
  })

  test('handles enter key to save changes', () => {
    renderTicket({ ticket, column })

    fireEvent.doubleClick(screen.getByText('Test Ticket'))

    const input = screen.getByDisplayValue('Test Ticket')
    fireEvent.change(input, { target: { value: 'Updated via Enter' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(mockEditTicket).toHaveBeenCalledWith(
      column,
      ticket.id,
      'Updated via Enter'
    )
  })
})
