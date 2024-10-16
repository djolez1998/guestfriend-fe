import { filterTickets } from './filterTickets'

describe('filterTickets', () => {
  const tickets = [
    { id: '1', content: 'Test Ticket One', column: 'todo' },
    { id: '2', content: 'Another Ticket', column: 'inProgress' },
    { id: '3', content: 'Test Ticket Two', column: 'todo' },
    { id: '4', content: 'Final Ticket', column: 'done' }
  ]

  it('should filter tickets by column and search query', () => {
    const result = filterTickets(tickets, 'todo', 'Test')
    expect(result).toEqual([
      { id: '1', content: 'Test Ticket One', column: 'todo' },
      { id: '3', content: 'Test Ticket Two', column: 'todo' }
    ])
  })

  it('should return an empty array when no tickets match the column', () => {
    const result = filterTickets(tickets, 'done', 'Test')
    expect(result).toEqual([])
  })

  it('should return an empty array when no tickets match the search query', () => {
    const result = filterTickets(tickets, 'todo', 'Nonexistent')
    expect(result).toEqual([])
  })

  it('should return all tickets from the specified column if the search query is empty', () => {
    const result = filterTickets(tickets, 'inProgress', '')
    expect(result).toEqual([
      { id: '2', content: 'Another Ticket', column: 'inProgress' }
    ])
  })

  it('should return an empty array when no tickets are provided', () => {
    const result = filterTickets([], 'todo', 'Test')
    expect(result).toEqual([])
  })

  it('should be case insensitive for the search query', () => {
    const result = filterTickets(tickets, 'todo', 'test')
    expect(result).toEqual([
      { id: '1', content: 'Test Ticket One', column: 'todo' },
      { id: '3', content: 'Test Ticket Two', column: 'todo' }
    ])
  })
})
