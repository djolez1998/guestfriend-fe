import { gql } from '@apollo/client'

export const GET_TICKETS = gql`
  query GetTickets {
    tickets {
      id
      content
      column
    }
  }
`

export const ADD_TICKET = gql`
  mutation AddTicket($content: String!, $column: String!) {
    addTicket(content: $content, column: $column) {
      id
      content
      column
    }
  }
`

export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: ID!) {
    deleteTicket(id: $id) {
      id
    }
  }
`

export const EDIT_TICKET = gql`
  mutation EditTicket($id: ID!, $content: String, $column: String) {
    editTicket(id: $id, content: $content, column: $column) {
      id
      content
      column
    }
  }
`

export const MOVE_TICKET = gql`
  mutation MoveTicket($id: ID!, $column: String!) {
    moveTicket(id: $id, column: $column) {
      id
      content
      column
    }
  }
`
