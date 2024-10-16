import React, { useState } from 'react'
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalBody,
  ModalTitle,
  CloseButton,
  Form,
  Input,
  SubmitButton
} from './ModalStyles'

const Modal = ({ modalType, onClose, onSubmit }) => {
  const [ticketContent, setTicketContent] = useState('')

  if (!modalType) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(ticketContent, modalType)
    setTicketContent('')
    onClose()
  }

  return (
    <ModalOverlay data-testid="modal">
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Add new ticket</ModalTitle>
          <CloseButton name="close" onClick={onClose}>
            &times;
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Input
              rows={10}
              placeholder="Ticket content"
              value={ticketContent}
              onChange={(e) => setTicketContent(e.target.value)}
              required
            />
            <SubmitButton type="submit">Add ticket</SubmitButton>
          </Form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default Modal
