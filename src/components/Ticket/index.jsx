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
    try {
      deleteTicketMutation({
        variables: { id },
        update(cache) {
          const cachedData = cache.readQuery({ query: GET_TICKETS })

          if (!cachedData || !cachedData.tickets) return

          const { tickets } = cachedData

          cache.writeQuery({
            query: GET_TICKETS,
            data: { tickets: tickets.filter((ticket) => ticket.id !== id) }
          })
        }
      })
    } catch (e) {
      console.log('Error:', e)
    }
  }

  const editTicket = (id, updatedContent) => {
    if (content.trim() !== ticket.content) {
      try {
        editTicketMutation({
          variables: { id, content: updatedContent, column: ticket.column },
          update: (cache, { data: { editTicket } }) => {
            const tickets =
              cache.readQuery({ query: GET_TICKETS })?.tickets || []

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
      } catch (e) {
        console.log('Error:', e)
      }
    }
    setIsEditing(false)
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
      data-testid={`ticket-${ticket.id}`}
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
      <DeleteButton
        data-testid={`delete-button-${ticket.id}`}
        onClick={() => deleteTicket(ticket.id)}
      >
        x
      </DeleteButton>
    </TicketWrapper>
  )
}

export default Ticket
