
import { Container, Card, ListGroup, Form, Button } from "react-bootstrap";
import { useState, useEffect, useRef, useContext } from "react";
import Chats from "./components/Chats";
import Chatrooms from "./components/Chatrooms";
import { Navigate, useNavigate } from "react-router-dom";
import userContext from './context/userContext.tsx'; 

function App() {

  const context = useContext(userContext);
  if (!context) {
    throw new Error("userContext must be used inside a UserProvider");
  }
  const [, setUser] = context;

  const usernameInput = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  function initializeUsername(e: React.FormEvent) {
    e.preventDefault();
    const username = usernameInput.current?.value.trim();
    if (!username) return;

    setUser(username);

    navigate('/chatrooms');
  }

  return <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
      <h5 className="mb-3 text-center">Enter your name to join</h5>
      <Form onSubmit={initializeUsername}>
        <Form.Control ref={usernameInput} placeholder="Your name" className="mb-3"></Form.Control>
        <Button type="submit" variant="primary" className="w-100">
          Join Chat
        </Button>
      </Form>
    </Card>
  </Container>
}

export default App;