import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import App from './App'

describe('App Component', () => {
  it('renders KanbanBoard within ApolloProvider', () => {
    // Render the App wrapped in a MockedProvider to avoid real API calls
    render(
      <MockedProvider>
        <App />
      </MockedProvider>
    )
  })
})
