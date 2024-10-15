import React, { useState, useContext } from 'react';
import Column from '../Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  BoardWrapper,
  SearchInput,
  ColumnsWrapper,
} from './KanbanBoardStyles';
import { KanbanContext } from '../../context/KanbanContext';

const KanbanBoard = () => {
  const { columns } = useContext(KanbanContext);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColumns = Object.keys(columns).reduce((acc, column) => {
    acc[column] = columns[column].filter((ticket) =>
      ticket.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return acc;
  }, {});

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
          {Object.keys(filteredColumns).map((column) => (
            <Column
              key={column}
              column={column}
              tickets={filteredColumns[column]}
            />
          ))}
        </ColumnsWrapper>
      </BoardWrapper>
    </DndProvider>
  );
};

export default KanbanBoard;
