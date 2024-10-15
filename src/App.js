import React from 'react'
import KanbanBoard from './components/KanbanBoard'
import { KanbanProvider } from './context/KanbanContext'
import GlobalStyles from './styles/GlobalStyles'

const App = () => {
  return (
    <KanbanProvider>
      <GlobalStyles />
      <KanbanBoard />
    </KanbanProvider>
  )
}

export default App
