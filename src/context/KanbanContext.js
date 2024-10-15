import React, { createContext, useState, useEffect } from 'react'

export const KanbanContext = createContext()

export const KanbanProvider = ({ children }) => {
  const initialState = {
    todo: [],
    inProgress: [],
    done: []
  }

  const [columns, setColumns] = useState(() => {
    try {
      const storedData = localStorage.getItem('kanban-columns')
      return storedData ? JSON.parse(storedData) : initialState
    } catch (error) {
      console.error('Failed to parse localStorage data:', error)
      return initialState
    }
  })

  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns))
  }, [columns])

  const addTicket = (column) => {
    const newTicket = { id: Date.now(), content: 'New ticket' }
    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: [...prevColumns[column], newTicket]
    }))
  }

  const deleteTicket = (column, id) => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: prevColumns[column].filter((ticket) => ticket.id !== id)
    }))
  }

  const editTicket = (column, id, newContent) => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: prevColumns[column].map((ticket) =>
        ticket.id === id ? { ...ticket, content: newContent } : ticket
      )
    }))
  }

  const moveTicket = (ticketId, fromColumn, toColumn) => {
    setColumns((prevColumns) => {
      const ticketToMove = prevColumns[fromColumn].find(
        (ticket) => ticket.id === ticketId
      )

      return {
        ...prevColumns,
        [fromColumn]: prevColumns[fromColumn].filter(
          (ticket) => ticket.id !== ticketId
        ),
        [toColumn]: [...prevColumns[toColumn], ticketToMove]
      }
    })
  }

  const value = {
    columns,
    addTicket,
    deleteTicket,
    editTicket,
    moveTicket
  }

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  )
}
