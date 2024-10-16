import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import KanbanBoard from '.'
import { GET_TICKETS } from '../../graphQueries'
import { columns } from '../../constants'
import '@testing-library/jest-dom'

// Mock data
const mockTicketsData = {
  tickets: [
    { id: 1, content: 'Ticket 1', column: 'todo', updated: '123' },
    { id: 2, content: 'Ticket 2', column: 'inProgress', updated: '123' },
    { id: 3, content: 'Ticket 3', column: 'done', updated: '123' }
  ]
}

// Mock GraphQL query
const mocks = [
  {
    request: {
      query: GET_TICKETS
    },
    result: {
      data: mockTicketsData
    }
  }
]

// Error mock
const errorMocks = [
  {
    request: {
      query: GET_TICKETS
    },
    error: new Error('Something went wrong')
  }
]

describe('KanbanBoard', () => {
  it('displays the loader while loading', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <KanbanBoard />
      </MockedProvider>
    )

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('displays an error message if the query fails', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <KanbanBoard />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })

  it('renders columns and tickets after data loads', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <KanbanBoard />
      </MockedProvider>
    )

    await waitFor(() => {
      columns.forEach((column) => {
        // expect(
        //   screen.getByText(
        //     `${column.title} (${
        //       mockTicketsData.tickets.filter(
        //         (ticket) => ticket.column === column.key
        //       ).length
        //     })`
        //   )
        // ).toBeInTheDocument()
        expect(
          screen.getByText(column.title, { exact: false })
        ).toBeInTheDocument()
      })
    })

    expect(screen.getByText('Ticket 1')).toBeInTheDocument()
    expect(screen.getByText('Ticket 2')).toBeInTheDocument()
    expect(screen.getByText('Ticket 3')).toBeInTheDocument()
  })

  it('filters tickets based on search query', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <KanbanBoard />
      </MockedProvider>
    )

    for (const column of columns) {
      await screen.findByText(column.title, { exact: false })
    }

    await screen.findByText('Ticket 1')
    await screen.findByText('Ticket 2')
    await screen.findByText('Ticket 3')

    // Enter search
    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'Ticket 1' }
    })

    // Check that only the filtered ticket is visible
    expect(screen.getByText('Ticket 1')).toBeInTheDocument()
    expect(screen.queryByText('Ticket 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Ticket 3')).not.toBeInTheDocument()
  })
})
