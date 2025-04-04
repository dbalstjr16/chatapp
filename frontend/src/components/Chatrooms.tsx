import { Container, Card, ListGroup } from "react-bootstrap";

function Chatrooms() {
    return <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Card className="shadow d-flex d-column" style={{ width: '100%', maxWidth: "500px", height: "80vh"}}>
                <Card.Header>

                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        <ListGroup.Item >Chatroom 1</ListGroup.Item>
                        <ListGroup.Item action onClick={() => console.log("hi")}>Chatroom 2</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>;
}

export default Chatrooms;