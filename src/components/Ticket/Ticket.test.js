import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Ticket from '.'
import { DELETE_TICKET, EDIT_TICKET, GET_TICKETS } from '../../graphQueries'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const mocks = [
  {
    request: { query: GET_TICKETS },
    result: {
      data: {
        tickets: [
          { id: '1', content: 'Test Ticket 1', column: 'todo' },
          { id: '2', content: 'Test Ticket 2', column: 'inProgress' }
        ]
      }
    }
  },
  {
    request: {
      query: DELETE_TICKET,
      variables: { id: '1' }
    },
    result: {
      data: {
        deleteTicket: { id: '1' }
      }
    }
  },
  {
    request: {
      query: EDIT_TICKET,
      variables: { id: '1', content: 'Updated Ticket', column: 'todo' }
    },
    result: {
      data: {
        editTicket: {
          id: '1',
          content: 'Updated Ticket',
          column: 'todo'
        }
      }
    }
  }
]

const ticket = { id: '1', content: 'Test Ticket', column: 'todo' }

const setup = () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DndProvider backend={HTML5Backend}>
        <Ticket ticket={ticket} column="todo" />
      </DndProvider>
    </MockedProvider>
  )
}

describe('Ticket Component', () => {
  it('renders ticket content', () => {
    setup()
    expect(screen.getByText('Test Ticket')).toBeInTheDocument()
  })

  it('deletes a ticket when delete button is clicked', async () => {
    setup()
    const deleteButton = screen.getByText('x')
    fireEvent.click(deleteButton)

    expect(mocks[1]?.result?.data?.deleteTicket?.id).toBe('1')
  })

  it('allows editing the ticket content', async () => {
    setup()
    const ticketContent = screen.getByText('Test Ticket')
    fireEvent.doubleClick(ticketContent)

    const input = screen.getByDisplayValue('Test Ticket')
    fireEvent.change(input, { target: { value: 'Updated Ticket' } })
    fireEvent.blur(input)

    expect(mocks[2]?.result?.data?.editTicket?.content).toBe('Updated Ticket')
  })
})
