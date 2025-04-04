import { io } from "socket.io-client";
import { Container, Card, ListGroup, Form, Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";

const socket = io(`http://localhost:3001`);

function App() {
  const [user, setUser] = useState<String | null>("");
  const [chat, setChat] = useState<{ username: string, text: string }[]>([]);

  const messageInput = useRef<HTMLInputElement>(null);
  const usernameInput = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setChat(prev => [...prev, msg]);
    })

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  function updateUsername(e: React.FormEvent) {
    e.preventDefault();
    const username = usernameInput.current?.value.trim();
    if (!username) return;

    setUser(username);
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const message = messageInput.current?.value.trim();
    if (!message) return;

    socket.emit('chat message', { username: user, text: message });
    messageInput.current!.value = "";
  }

  if (!user) {
    return <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h5 className="mb-3 text-center">Enter your name to join</h5>
        <Form onSubmit={updateUsername}>
          <Form.Control ref={usernameInput} placeholder="Your name" className="mb-3"></Form.Control>
          <Button type="submit" variant="primary" className="w-100">
            Join Chat
          </Button>
        </Form>
      </Card>
    </Container>
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="shadow d-flex flex-column" style={{ width: '100%', maxWidth: '500px', height: '80vh' }}>
        <Card.Header className="bg-primary text-white text-center">
          <h5 className="mb-0">Welcome, {user}</h5>
        </Card.Header>
  
        <ListGroup variant="flush" className="flex-grow-1 overflow-auto p-3">
          {chat.map((chat, index) =>
            user === chat.username ? (
              <ListGroup.Item key={index} className="mb-2 d-flex justify-content-end border-0">
                <div className="px-3 py-2 rounded" style={{ backgroundColor: '#f6dcf7', maxWidth: '70%' }}>
                  {chat.text}
                </div>
              </ListGroup.Item>
            ) : (
              <ListGroup.Item key={index} className="mb-2 d-flex justify-content-start border-0">
                <div className="px-3 py-2 rounded" style={{ backgroundColor: '#d1e7dd', maxWidth: '70%' }}>
                  <strong className="d-block mb-1">{chat.username}</strong>
                  {chat.text}
                </div>
              </ListGroup.Item>
            )
          )}
          <div ref={bottomRef}></div>
        </ListGroup>
  
        <Card.Footer>
          <Form onSubmit={sendMessage} className="d-flex gap-2">
            <Form.Control placeholder="Type a message..." ref={messageInput} />
            <Button type="submit" variant="primary">Send</Button>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
  

}

export default App;