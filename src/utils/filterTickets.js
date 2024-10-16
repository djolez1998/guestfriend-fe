export const filterTickets = (tickets = [], column, searchQuery) => {
  return tickets
    .filter((ticket) => ticket.column === column)
    .filter(({ content }) =>
      content.toLowerCase().includes(searchQuery.toLowerCase())
    )
}
