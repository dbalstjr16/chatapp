import { Container, Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';

const GET_CHATROOMS_QUERY = gql`
    query GetChatrooms {
        chatrooms {
            id
            name
            isPrivate
        }
    }
`;

interface Chatroom {
    id: string,
    name: string,
    description: string | null,
    created_at: string,
    isPrivate: boolean,
}

function Chatrooms() {
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(GET_CHATROOMS_QUERY);
    if (loading) return <p>Loading chatrooms...</p>;
    if (error) return <p>Error loading chatrooms</p>;

    return <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Card className="shadow d-flex d-column" style={{ width: '100%', maxWidth: "500px", height: "80vh"}}>
                <Card.Header>
                    <h6 style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>Select a Chatroom!</h6>
                    <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '0', right: '0', 
                        marginTop: '0.5rem', marginRight: '0.5rem', border: 'none', 
                        backgroundColor: 'grey', borderRadius: '5px', color: 'white' }}>Logout</button>
                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        {
                            data.chatrooms.map((chatroom: Chatroom) => {
                                return <ListGroup.Item action 
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                                        onClick={() => navigate(`/chats/${chatroom.id}`)}>
                                        <span>{chatroom.name}</span>
                                        <span style={{ fontSize: '0.9rem', color: '#888'}}>{chatroom.isPrivate ? 'private' : 'public'}</span>
                                    </ListGroup.Item>
                            })
                        }
                        
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>;
}

export default Chatrooms;