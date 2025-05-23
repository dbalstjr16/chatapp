import { Container, Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Chatrooms() {
    const navigate = useNavigate();

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
                        <ListGroup.Item >Chatroom 1</ListGroup.Item>
                        <ListGroup.Item action onClick={() => navigate('/chats')}>Chatroom 2</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>;
}

export default Chatrooms;