import React from 'react'

// styled components
import { LoaderContainer, Loader } from './LoaderStyles'

const LoaderComponent = () => {
  return (
    <LoaderContainer data-testid="loader">
      <Loader />
    </LoaderContainer>
  )
}

export default LoaderComponent
