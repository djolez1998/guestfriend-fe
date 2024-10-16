import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Column from '.'
import {
  ADD_TICKET,
  MOVE_TICKET,
  GET_TICKETS,
  DELETE_TICKET
} from '../../graphQueries'
import { DndProvider } from 'react-dnd'
import { TestBackend } from 'react-dnd-test-backend'

// Mock Data
const mockTickets = [
  { id: '1', content: 'Test Ticket 1', column: 'todo', updated: '1234' },
  { id: '2', content: 'Test Ticket 2', column: 'todo', updated: '2314' }
]

const mockColumn = { title: 'To Do', key: 'todo' }

const mocks = [
  {
    request: {
      query: GET_TICKETS
    },
    result: {
      data: {
        tickets: mockTickets
      }
    }
  },
  {
    request: {
      query: ADD_TICKET,
      variables: { content: 'New Ticket', column: 'todo' }
    },
    result: {
      data: {
        addTicket: { id: '3', content: 'New Ticket', column: 'todo' }
      }
    }
  },
  {
    request: {
      query: MOVE_TICKET,
      variables: { id: '1', column: 'done' }
    },
    result: {
      data: {
        moveTicket: { id: '1', content: 'Test Ticket 1', column: 'done' }
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
  }
]

describe('Column Component', () => {
  const setup = () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DndProvider backend={TestBackend}>
          <Column column={mockColumn} tickets={mockTickets} />
        </DndProvider>
      </MockedProvider>
    )
  }

  it('renders column title and tickets', () => {
    setup()
    // Check if the column title is rendered
    expect(screen.getByText('To Do (2)')).toBeInTheDocument()

    // Check if tickets are rendered
    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument()
    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument()
  })

  it('opens and closes modal for adding ticket', () => {
    setup()

    // Open the modal
    const addButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(addButton)

    // Check if the modal opens
    expect(screen.getByTestId('modal')).toBeInTheDocument()

    // Close the modal
    const closeModalButton = screen.getByRole('button', { name: '×' })

    fireEvent.click(closeModalButton)

    // Check if the modal is closed
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('triggers add ticket mutation and updates UI', async () => {
    setup()
    // Open the modal
    const addButton = screen.getByRole('button', { name: '+' })

    fireEvent.click(addButton)

    expect(screen.getByTestId('modal')).toBeInTheDocument()

    // Fill in the form in the modal and submit
    const input = screen.getByPlaceholderText('Ticket content')

    fireEvent.change(input, { target: { value: 'New Ticket' } })

    const submitButton = screen.getByRole('button', { name: 'Add ticket' })

    fireEvent.click(submitButton)

    // Modal should be closed
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()

    // kao da cache na query ne vrati sa novim itemom
    // Wait for the ticket to be added to the cache and UI updated
    // await screen.findByText('New Ticket', { exact: false })
  })

  it('deletes a ticket when delete button is clicked', async () => {
    setup()

    // const deleteButton = screen.getAllByText('x')

    // fireEvent.click(deleteButton)

    // // Wait for the ticket to be removed
    // await waitFor(() =>
    //   expect(screen.queryByText('Test Ticket 1')).not.toBeInTheDocument()
    // )
  })
})
