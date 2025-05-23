import { Container, Card, ListGroup, Form, Button } from "react-bootstrap";
import { useEffect, useState, useRef, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import userContext from "../context/userContext";

const socket = io(`http://localhost:3001`);

type Chat = {
  username: string,
  text: string,
  chatroomId: number
};

const GET_OLDMESSAGES_QUERY = gql`
  query GetMessages($chatroomId: Int!) {
    messages(chatroomId: $chatroomId) {
      username
      text
      chatroomId
    }
  }
`;

function Chats() {
  const params = useParams();
  const chatroomId = params.chatroomId ? parseInt(params.chatroomId, 10) : null;

  const context = useContext(userContext);
  if (!context) throw new Error("");
  const [user] = context;

  const [chat, setChat] = useState<Chat[]>([]);
  const [justSentMessage, setJustSentMessage] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const messageInput = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { data, refetch } = useQuery(GET_OLDMESSAGES_QUERY, {
    variables: { chatroomId },
    fetchPolicy: "network-only",
    skip: !chatroomId || isNaN(chatroomId),
  });

  // Reset scroll flag when chatroom changes
  useEffect(() => {
    setInitialLoadDone(false);
  }, [chatroomId]);

  // Socket join room
  useEffect(() => {
    if (chatroomId) {
      socket.emit("joinRoom", chatroomId);
    }
  }, [chatroomId]);

  // Helper: is user near bottom?
  function isNearBottom(): boolean {
    const container = chatContainerRef.current;
    if (!container) return false;
    const threshold = 100;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom < threshold;
  }

  // Handle incoming socket messages
  useEffect(() => {
    socket.on("chat message", (msg) => {
      if (msg.chatroomId === chatroomId) {
        setChat((prev) => [...prev, msg]);

        if (isNearBottom()) {
          requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          });
        }
      }
    });

    return () => {
      socket.off("chat message");
    };
  }, [chatroomId]);

  // Scroll on just-sent message
  useEffect(() => {
    if (justSentMessage) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setJustSentMessage(false);
    }
  }, [chat]);

  // Scroll once on initial data load
  useEffect(() => {
    if (data && data.messages) {
      setChat(data.messages);
      if (!initialLoadDone) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "auto" });
        });
        setInitialLoadDone(true);
      }
    }
  }, [data]);

  // Sending message
  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const message = messageInput.current?.value.trim();
    if (!message) return;

    socket.emit("chat message", { username: user, text: message, chatroomId });
    messageInput.current!.value = "";
    setJustSentMessage(true);
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="shadow d-flex flex-column" style={{ width: '100%', maxWidth: '500px', height: '80vh' }}>
        <Card.Header className="bg-primary text-white text-center">
          <Button
            variant="light"
            size="sm"
            className="position-absolute top-0 start-0 ms-2"
            style={{ marginTop: '0.375rem' }}
            onClick={() => navigate('/chatrooms')}
          >
            <i className="bi bi-arrow-left"></i>
          </Button>
          <h5 className="mb-0">Welcome, {user}</h5>
        </Card.Header>

        <ListGroup
          variant="flush"
          className="flex-grow-1 overflow-auto p-3"
          ref={chatContainerRef}
        >
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

export default Chats;
