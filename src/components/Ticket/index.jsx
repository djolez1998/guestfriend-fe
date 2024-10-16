import React, { useState } from 'react'

// libs
import { useDrag } from 'react-dnd'
import { useMutation } from '@apollo/client'

// styled components
import { TicketWrapper, DeleteButton, StyledInput } from './TicketStyles'

// queries
import { DELETE_TICKET, EDIT_TICKET, GET_TICKETS } from '../../graphQueries'

const Ticket = ({ ticket, column }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(ticket.content)

  const [deleteTicketMutation] = useMutation(DELETE_TICKET)
  const [editTicketMutation] = useMutation(EDIT_TICKET)

  const deleteTicket = (id) => {
    deleteTicketMutation({
      variables: { id },
      update(cache) {
        // const { tickets } = cache.readQuery({ query: GET_TICKETS })
        const cachedData = cache.readQuery({ query: GET_TICKETS })

        if (!cachedData || !cachedData.tickets) return

        const { tickets } = cachedData

        cache.writeQuery({
          query: GET_TICKETS,
          data: { tickets: tickets.filter((ticket) => ticket.id !== id) }
        })
      }
    })
  }

  const editTicket = (id, updatedContent) => {
    editTicketMutation({
      variables: { id, content: updatedContent, column: ticket.column },
      update(cache, { data: { editTicket } }) {
        const { tickets } = cache.readQuery({ query: GET_TICKETS })
        cache.writeQuery({
          query: GET_TICKETS,
          data: {
            tickets: tickets.map((ticket) =>
              ticket.id === id ? editTicket : ticket
            )
          }
        })
      }
    })
  }

  const [{ opacity }, drag] = useDrag(() => ({
    type: 'TICKET',
    item: { id: ticket.id, column },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  }))

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (content.trim() !== ticket.content) {
      editTicket(ticket.id, content.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  return (
    <TicketWrapper
      ref={drag}
      $column={column}
      style={{ opacity: opacity }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <StyledInput
          type="textarea"
          rows="4"
          cols="50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          data-testid="ticket-input"
        />
      ) : (
        <p>{ticket.content}</p>
      )}
      <DeleteButton onClick={() => deleteTicket(ticket.id)}>x</DeleteButton>
    </TicketWrapper>
  )
}

export default Ticket
