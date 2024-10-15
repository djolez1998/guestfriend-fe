import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import Ticket from '../Ticket';
import {
  ColumnWrapper,
  ColumnHeader,
  AddButton,
  ColumnTitle,
  ColumnBody
} from './ColumnStyles';
import { KanbanContext } from '../../context/KanbanContext';

const translations = {
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done'
}


const Column = ({ column, tickets }) => {
  const { addTicket, moveTicket } = useContext(KanbanContext);

  const [, drop] = useDrop(() => ({
    accept: 'TICKET',
    drop: (draggedItem) => {
      if (draggedItem.column !== column) {
        moveTicket(draggedItem.id, draggedItem.column, column);
      }
    },
  }));

  return (
    // `column-wrapper-${column}`
    <ColumnWrapper $column={column} ref={drop} data-testid={`column-wrapper-${column}`}> 
      <ColumnHeader $column={column}>
        <ColumnTitle>
          {`${translations[column]} (${tickets.length})`}
        </ColumnTitle>
        <AddButton $column={column} onClick={() => addTicket(column)}>+</AddButton>
      </ColumnHeader>
      <ColumnBody data-testid={`column-body-${column}`}>
        {tickets.map((ticket) => (
          <Ticket key={ticket.id} ticket={ticket} column={column} />
        ))}
      </ColumnBody>
    </ColumnWrapper>
  );
};

export default Column;
