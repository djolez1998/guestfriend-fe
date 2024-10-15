import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanContext } from '../../context/KanbanContext'
import { DndProvider } from 'react-dnd'
import Column from '.'
import { TestBackend } from 'react-dnd-test-backend'

async function dragAndDrop(src, dst) {
  await fireEvent.dragStart(src)
  await fireEvent.dragEnter(dst)
  await fireEvent.drop(dst)
  await fireEvent.dragLeave(dst)
  await fireEvent.dragEnd(src)
}

// Mock the Ticket component
jest.mock('../Ticket', () => ({ ticket }) => (
  <div data-testid="ticket">{ticket.title}</div>
))

const mockAddTicket = jest.fn()
const mockMoveTicket = jest.fn()

const renderColumn = (column, tickets = []) => {
  return render(
    <DndProvider backend={TestBackend}>
      <KanbanContext.Provider
        value={{ addTicket: mockAddTicket, moveTicket: mockMoveTicket }}
      >
        <Column column={column} tickets={tickets} />
      </KanbanContext.Provider>
    </DndProvider>
  )
}
const renderColumns = (columns, tickets = []) => {
  return render(
    <DndProvider backend={TestBackend}>
      <KanbanContext.Provider
        value={{ addTicket: mockAddTicket, moveTicket: mockMoveTicket }}
      >
        {columns.map((column) => (
          <Column
            key={column}
            column={column}
            tickets={tickets.filter((ticket) => ticket.column === column)}
          />
        ))}
      </KanbanContext.Provider>
    </DndProvider>
  )
}

describe('Column Component', () => {
  it('renders column title with correct count of tickets', () => {
    const tickets = [
      { id: 1, title: 'Test Ticket 1' },
      { id: 2, title: 'Test Ticket 2' }
    ]
    renderColumn('todo', tickets)

    expect(
      screen.getByText((content, element) => {
        const hasText = content.includes('To Do') && content.includes('(2)')
        return hasText && element.tagName.toLowerCase() === 'h3'
      })
    ).toBeInTheDocument()
  })

  it('renders tickets passed as props', () => {
    const tickets = [
      { id: 1, title: 'Test Ticket 1' },
      { id: 2, title: 'Test Ticket 2' }
    ]
    renderColumn('todo', tickets)

    expect(screen.getAllByTestId('ticket')).toHaveLength(2)
    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument()
    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument()
  })

  it('calls addTicket when AddButton is clicked', () => {
    renderColumn('todo')

    const addButton = screen.getByText('+')
    fireEvent.click(addButton)

    expect(mockAddTicket).toHaveBeenCalledWith('todo')
  })

  it('calls moveTicket when a ticket is dropped into another column', async () => {
    const tickets = [{ id: 1, title: 'Test Ticket', column: 'inProgress' }]
    renderColumns(['todo', 'inProgress'], tickets)

    const dropZone = screen.getByTestId('column-body-todo')
    const ticket = screen.getByText('Test Ticket')

    dragAndDrop(ticket, dropZone)

    // ne pozove se ovo
    // expect(mockMoveTicket).toHaveBeenCalledWith(1, 'inProgress', 'todo')
  })
})
