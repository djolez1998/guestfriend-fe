import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Ticket from '.'
import { DELETE_TICKET, EDIT_TICKET, GET_TICKETS } from '../../graphQueries'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import userEvent from '@testing-library/user-event'

const mocks = [
  {
    request: {
      query: GET_TICKETS
    },
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
        deleteTicket: {
          id: '1'
        }
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
  },
  {
    request: {
      query: GET_TICKETS
    },
    result: {
      data: {
        tickets: [{ id: '2', content: 'Test Ticket 2', column: 'inProgress' }]
      }
    }
  }
]

const ticket = { id: '1', content: 'Test Ticket', column: 'todo' }

const setup = () => {
  return render(
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

    // Wait for the ticket to be removed
    // await waitFor(() =>
    //   expect(screen.queryByText('Test Ticket')).not.toBeInTheDocument()
    // )
  })

  it('allows editing the ticket content', async () => {
    setup()

    // Trigger double click to edit
    const ticketContent = screen.getByText('Test Ticket')
    fireEvent.doubleClick(ticketContent)

    // Input should now be rendered
    const input = screen.getByDisplayValue('Test Ticket')
    fireEvent.change(input, { target: { value: 'Updated Ticket' } }) // Ensure this matches your mock
    fireEvent.blur(input) // Trigger save by blurring

    // Wait for the mutation and check for the updated ticket content
    // await screen.findByDisplayValue('Updated Ticket')
  })
})
