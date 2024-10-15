import styled from 'styled-components'

export const BoardWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const SearchInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  width: 300px;
  font-size: 16px;
  align-self: flex-end;
`

export const ColumnsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    gap: 10px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }
`
