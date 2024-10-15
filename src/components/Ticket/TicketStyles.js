import styled from 'styled-components'

export const TicketWrapper = styled.div`
  background-color: ${({ $column }) => {
    switch ($column) {
      case 'todo':
        return '#54afe0'
      case 'inProgress':
        return '#e66978'
      case 'done':
        return '#465e72'
      default:
        return '#f4f4f4'
    }
  }};
  color: white;
  font-size: 18px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover button {
    opacity: 1;
  }
`

export const StyledInput = styled.textarea`
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 2px solid #007bff;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #0056b3;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  }

  &::placeholder {
    color: #888;
  }
`

export const DeleteButton = styled.button`
  background: red;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 18px;
  align-self: flex-start;

  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    background: darkred;
  }
`
