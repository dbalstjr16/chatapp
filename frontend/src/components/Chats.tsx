import { Container, Card, ListGroup, Form, Button } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { gql, useQuery } from "@apollo/client";
import { io } from "socket.io-client";

const socket = io(`http://localhost:3001`);

type Chat = {
    username: string,
    text: string
}

const GET_OLDMESSAGES_QUERY = gql`
  query GetMessages {
    messages {
      username
      text
    }
  }
`;

function Chats(props: any) {

    const { user } = props;
    const [chat, setChat] = useState<Chat[]>([]);

    const messageInput = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // ------ Fetch Messages from History Log ------
    const { data } = useQuery(GET_OLDMESSAGES_QUERY);

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

    useEffect(() => {
        if (data && data.messages) {
            setChat(data.messages);
        }
    }, [data]);

    function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        const message = messageInput.current?.value.trim();
        if (!message) return;

        socket.emit('chat message', { username: user, text: message });
        messageInput.current!.value = "";
    }

    return <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
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
}

export default Chats;