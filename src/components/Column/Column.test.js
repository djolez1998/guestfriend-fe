import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import Column from '.'

import { ADD_TICKET, MOVE_TICKET, GET_TICKETS } from '../../graphQueries'
import { DndProvider } from 'react-dnd'
import { TestBackend } from 'react-dnd-test-backend'

const mockTickets = [
  { id: '1', content: 'Test Ticket 1', column: 'todo' },
  { id: '2', content: 'Test Ticket 2', column: 'todo' }
]

const mockColumn = { title: 'To Do', key: 'todo' }

const mockColumn1 = { title: 'To Do', key: 'todo' }
const mockColumn2 = { title: 'In Progress', key: 'inProgress' }

const mocks = [
  {
    request: { query: GET_TICKETS },
    result: {
      data: { tickets: mockTickets }
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
      variables: { id: '1', column: 'inProgress' }
    },
    result: {
      data: {
        moveTicket: { id: '1', content: 'Test Ticket 1', column: 'inProgress' }
      }
    }
  }
]

describe('Column Component', () => {
  const setup = () => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DndProvider backend={TestBackend}>
          <Column column={mockColumn} tickets={mockTickets} />
        </DndProvider>
      </MockedProvider>
    )
  }

  it('renders tickets', async () => {
    setup()

    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument()

    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument()

    expect(screen.getByText('To Do (2)')).toBeInTheDocument()

    expect(screen.getByTestId('column-wrapper-todo')).toHaveStyle(
      'background-color: #bee1f5'
    )
  })

  // https://www.ignek.com/blog/test-graphql-queries-and-mutation-using-rtl-and-jest/
  it('opens modal, adds new ticket, and updates UI', async () => {
    setup()

    expect(screen.getByText('To Do (2)')).toBeInTheDocument()

    const addButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(addButton)

    const modal = await screen.findByTestId('modal')
    expect(modal).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Ticket content'), {
      target: { value: 'New Ticket' }
    })

    fireEvent.click(screen.getByText('Add ticket'))

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()

    expect(mocks[1]?.result?.data?.addTicket?.id).toBe('3')
  })

  it('moves a ticket to a different column and updates the UI', async () => {
    const setupTwoColumns = () => {
      return render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DndProvider backend={TestBackend}>
            <div>
              <Column column={mockColumn1} tickets={mockTickets} />
              <Column column={mockColumn2} tickets={[]} />
            </div>
          </DndProvider>
        </MockedProvider>
      )
    }

    setupTwoColumns()

    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument()

    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument()

    expect(screen.getByText('To Do (2)')).toBeInTheDocument()

    const ticket = screen.getByText('Test Ticket 1')
    const dropTarget = screen.getByTestId('column-body-inProgress')

    fireEvent.dragStart(ticket)
    fireEvent.dragEnter(dropTarget)
    fireEvent.dragOver(dropTarget)
    fireEvent.drop(dropTarget)
    fireEvent.dragEnd(ticket)

    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument()
  })
})
