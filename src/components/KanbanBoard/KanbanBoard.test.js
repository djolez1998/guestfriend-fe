import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import KanbanBoard from '.'
import { KanbanContext } from '../../context/KanbanContext'

const columnsMock = {
  todo: [
    { id: 1, content: 'Task 1' },
    { id: 2, content: 'Task 2' }
  ],
  inProgress: [
    { id: 3, content: 'Task 3' },
    { id: 4, content: 'Task 4' }
  ],
  done: [{ id: 5, content: 'Task 5' }]
}

test('renders KanbanBoard and performs search', () => {
  render(
    <KanbanContext.Provider value={{ columns: columnsMock }}>
      <DndProvider backend={HTML5Backend}>
        <KanbanBoard />
      </DndProvider>
    </KanbanContext.Provider>
  )

  expect(screen.getByText('Task 1')).toBeInTheDocument()
  expect(screen.getByText('Task 2')).toBeInTheDocument()
  expect(screen.getByText('Task 3')).toBeInTheDocument()
  expect(screen.getByText('Task 4')).toBeInTheDocument()
  expect(screen.getByText('Task 5')).toBeInTheDocument()

  expect(
    screen.getByText(`To Do (${columnsMock.todo.length})`)
  ).toBeInTheDocument()

  const searchInput = screen.getByPlaceholderText('Search...')
  fireEvent.change(searchInput, { target: { value: 'Task 1' } })

  expect(screen.getByText('Task 1')).toBeInTheDocument()
  expect(screen.getByText('To Do (1)')).toBeInTheDocument()

  expect(screen.queryByText('Task 2')).not.toBeInTheDocument()
  expect(screen.queryByText('Task 3')).not.toBeInTheDocument()
  expect(screen.queryByText('Task 4')).not.toBeInTheDocument()
  expect(screen.queryByText('Task 5')).not.toBeInTheDocument()
})
