
import { Container, Card, Form, Button } from "react-bootstrap";
import { useState, useRef } from "react";
import Chats from "./components/Chats";

function App() {
  const [user, setUser] = useState<string | null>("");
  const usernameInput = useRef<HTMLInputElement>(null);

  function initializeUsername(e: React.FormEvent) {
    e.preventDefault();
    const username = usernameInput.current?.value.trim();
    if (!username) return;

    setUser(username);
  }

  if (!user) {
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

  return (
    //<Chatrooms></Chatrooms>
    <Chats user={user}></Chats>
  );
}

export default App;