import React, { useState } from 'react'

// libs
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useQuery } from '@apollo/client'

// components
import Column from '../Column'
import Loader from '../Loader'

// styled components
import { BoardWrapper, SearchInput, ColumnsWrapper } from './KanbanBoardStyles'

// utils
import { filterTickets } from '../../utils/filterTickets'

// constants
import { columns } from '../../constants'

// queries
import { GET_TICKETS } from '../../graphQueries'

const KanbanBoard = () => {
  const { loading, error, data } = useQuery(GET_TICKETS)

  const [searchQuery, setSearchQuery] = useState('')

  if (loading) return <Loader />

  if (error) return <p>Error: {error.message}</p>

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardWrapper>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ColumnsWrapper>
          {columns.map((column) => (
            <Column
              key={column.key}
              column={column}
              tickets={filterTickets(data.tickets, column.key, searchQuery)}
            />
          ))}
        </ColumnsWrapper>
      </BoardWrapper>
    </DndProvider>
  )
}

export default KanbanBoard
