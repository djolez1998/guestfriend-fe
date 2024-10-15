import styled from 'styled-components'

export const ColumnWrapper = styled.div`
  background-color: ${({ $column }) => {
    switch ($column) {
      case 'todo':
        return '#bee1f5'
      case 'inProgress':
        return '#f0bec3'
      case 'done':
        return '#b9c3c8'
      default:
        return '#f4f4f4'
    }
  }};
  flex: 1;
  min-width: 250px;
  max-width: 33%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 900px) {
    max-width: 45%;
  }

  @media (max-width: 600px) {
    max-width: 100%;
  }
`

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
  background-color: ${({ $column }) => {
    switch ($column) {
      case 'todo':
        return '#1991d7'
      case 'inProgress':
        return '#e1285a'
      case 'done':
        return '#0f233c'
      default:
        return '#f4f4f4'
    }
  }};
`

export const ColumnBody = styled.div`
  padding: 20px;
`

export const ColumnTitle = styled.h3`
  color: #fff;
`

export const AddButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 25px;

  &:hover {
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
  }
`
