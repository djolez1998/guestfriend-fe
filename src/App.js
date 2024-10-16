import React from 'react'
import KanbanBoard from './components/KanbanBoard'
import GlobalStyles from './styles/GlobalStyles'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <GlobalStyles />
      <KanbanBoard />
    </ApolloProvider>
  )
}

export default App
