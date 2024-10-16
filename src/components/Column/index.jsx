import React, { useState } from 'react'

// libs
import { useDrop } from 'react-dnd'
import { useMutation } from '@apollo/client'

// components
import Ticket from '../Ticket'
import Modal from '../Modal'

// styled components
import {
  ColumnWrapper,
  ColumnHeader,
  AddButton,
  ColumnTitle,
  ColumnBody
} from './ColumnStyles'

// queries
import { GET_TICKETS, ADD_TICKET, MOVE_TICKET } from '../../graphQueries'

const Column = ({ column, tickets }) => {
  const [modalType, setModalType] = useState(null)

  const openModal = (modalType) => setModalType(modalType)
  const closeModal = () => setModalType(null)

  const [addTicketMutation] = useMutation(ADD_TICKET)
  const [moveTicketMutation] = useMutation(MOVE_TICKET)

  const handleAddTicket = (content, column) => {
    addTicketMutation({
      variables: { content, column },
      update(cache, { data: { addTicket } }) {
        // If cache.readQuery returns null
        const existingData = cache.readQuery({ query: GET_TICKETS })
        const tickets = existingData ? existingData.tickets : []

        cache.writeQuery({
          query: GET_TICKETS,
          data: { tickets: [...tickets, addTicket] }
        })
      }
    })
  }

  const moveTicket = (id, toColumn) => {
    moveTicketMutation({
      variables: { id, column: toColumn },
      update(cache) {
        const { tickets } = cache.readQuery({ query: GET_TICKETS })

        const updatedTickets = tickets.map((ticket) =>
          ticket.id === id ? { ...ticket, column: toColumn } : ticket
        )

        cache.writeQuery({
          query: GET_TICKETS,
          data: { tickets: updatedTickets }
        })
      }
    })
  }

  const columnTitle = column.title
  const columnKey = column.key

  const [, drop] = useDrop(() => ({
    accept: 'TICKET',
    drop: (draggedItem) => {
      if (draggedItem.column !== columnKey) {
        moveTicket(draggedItem.id, columnKey)
      }
    }
  }))

  return (
    <ColumnWrapper $column={columnKey} ref={drop}>
      <ColumnHeader $column={columnKey}>
        <ColumnTitle>{`${columnTitle} (${tickets.length})`}</ColumnTitle>
        <AddButton $column={columnKey} onClick={() => openModal(columnKey)}>
          +
        </AddButton>
      </ColumnHeader>
      <ColumnBody>
        {tickets.map((ticket) => (
          <Ticket key={ticket.id} ticket={ticket} column={columnKey} />
        ))}
      </ColumnBody>
      <Modal
        modalType={modalType}
        onClose={closeModal}
        onSubmit={handleAddTicket}
      />
    </ColumnWrapper>
  )
}

export default Column
