const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const { ApolloServer } = require('@apollo/server');
const { gql } = require('graphql-tag');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');

const pool = require('./db/database');

const app = express();
const server = http.createServer(app);

// ----- Socket.io Setup -----
const io = new Server(server, {
    cors: {origin: '*'}
});

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);
    console.log('Total connected:', io.engine.clientsCount);

    socket.on('chat message', async (msg) => {
        io.emit('chat message', msg);

        await pool.query(`INSERT INTO chats (username, text) 
            VALUES ($1, $2)
            `, [msg.username, msg.text]);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected: ', socket.id);
    });
});

// ----- GraphQL Setup -----
const typeDefs = gql`
    type Query {
        messages: [userMessage!]!
    }

    type Chat {
        id: ID!
        username: String!
        text: String!
        created_at: String!
    }

    type userMessage {
        username: String!
        text: String!
    }
`;

const resolvers = {
    Query : {
        messages: async () => {
            const result = await pool.query(`SELECT username, text FROM chats
                ORDER BY created_at ASC`); 
            return result.rows;
        },
    },
};

async function startApolloServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();

    app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(apolloServer));
}

startApolloServer().then(() => {
    server.listen(3001, () => {
        console.log("Server running on http://localhost:3001");
        console.log('GraphQL available at http://localhost:3001/graphql');
    });
})

