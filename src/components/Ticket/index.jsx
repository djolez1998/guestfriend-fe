import React, { useState, useContext } from 'react';
import { useDrag } from 'react-dnd';
import { TicketWrapper, DeleteButton, StyledInput } from './TicketStyles';
import { KanbanContext } from '../../context/KanbanContext';

const Ticket = ({ ticket, column }) => {
  const { deleteTicket, editTicket } = useContext(KanbanContext);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(ticket.content);

  const [{ opacity }, drag] = useDrag(() => ({
    type: 'TICKET',
    item: { id: ticket.id, column },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    }),
  }));

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (content.trim() !== ticket.content) {
      editTicket(column, ticket.id, content.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

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
        />
      ) : (
        <p>{ticket.content}</p>
      )}
      <DeleteButton onClick={() => deleteTicket(column, ticket.id)}>
        x
      </DeleteButton>
    </TicketWrapper>
  );
};

export default Ticket;
