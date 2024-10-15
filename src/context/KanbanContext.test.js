import React, { useContext } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanProvider, KanbanContext } from './KanbanContext'

// Test component to consume the context
const KanbanTestComponent = () => {
  const { columns, addTicket, deleteTicket, editTicket, moveTicket } =
    useContext(KanbanContext)

  return (
    <div>
      <div data-testid="todo-column">
        {columns.todo.map((ticket) => (
          <div key={ticket.id} data-testid={`ticket-${ticket.id}`}>
            {ticket.content}
          </div>
        ))}
      </div>
      <button onClick={() => addTicket('todo')} data-testid="add-ticket">
        Add Ticket
      </button>
      <button
        onClick={() => deleteTicket('todo', columns.todo[0]?.id)}
        data-testid="delete-ticket"
      >
        Delete Ticket
      </button>
      <button
        onClick={() =>
          editTicket('todo', columns.todo[0]?.id, 'Edited Content')
        }
        data-testid="edit-ticket"
      >
        Edit Ticket
      </button>
      <button
        onClick={() => moveTicket(columns.todo[0]?.id, 'todo', 'inProgress')}
        data-testid="move-ticket"
      >
        Move Ticket
      </button>
    </div>
  )
}

describe('KanbanContext', () => {
  beforeEach(() => {
    localStorage.clear() // Clear localStorage before each test to avoid state pollution
  })

  it('should add a new ticket to the "todo" column', async () => {
    render(
      <KanbanProvider>
        <KanbanTestComponent />
      </KanbanProvider>
    )

    const addTicketButton = screen.getByTestId('add-ticket')

    fireEvent.click(addTicketButton)

    expect(await screen.findByText('New ticket')).toBeInTheDocument()
  })

  it('should delete a ticket from the "todo" column', async () => {
    render(
      <KanbanProvider>
        <KanbanTestComponent />
      </KanbanProvider>
    )

    // Add a ticket first
    fireEvent.click(screen.getByTestId('add-ticket'))

    // Delete the ticket
    fireEvent.click(screen.getByTestId('delete-ticket'))

    expect(screen.queryByText('New ticket')).not.toBeInTheDocument()
  })

  it('should edit a ticket in the "todo" column', async () => {
    render(
      <KanbanProvider>
        <KanbanTestComponent />
      </KanbanProvider>
    )

    // Add a ticket first
    fireEvent.click(screen.getByTestId('add-ticket'))

    // Edit the ticket
    fireEvent.click(screen.getByTestId('edit-ticket'))

    expect(await screen.findByText('Edited Content')).toBeInTheDocument()
  })

  it('should move a ticket from "todo" to "inProgress" column', async () => {
    render(
      <KanbanProvider>
        <KanbanTestComponent />
      </KanbanProvider>
    )

    // Add a ticket first
    fireEvent.click(screen.getByTestId('add-ticket'))

    // Move the ticket to inProgress
    fireEvent.click(screen.getByTestId('move-ticket'))

    expect(screen.queryByText('New ticket')).not.toBeInTheDocument()
    // Optionally, test that the ticket was moved to inProgress column by adding an element for that column and checking it
  })

  it('should store columns state in localStorage', async () => {
    render(
      <KanbanProvider>
        <KanbanTestComponent />
      </KanbanProvider>
    )

    fireEvent.click(screen.getByTestId('add-ticket'))

    const storedData = JSON.parse(localStorage.getItem('kanban-columns'))
    expect(storedData.todo.length).toBe(1)
  })
})
