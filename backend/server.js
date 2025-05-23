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

        await pool.query(`INSERT INTO chats (username, text, chatroom_id) 
            VALUES ($1, $2, $3)
            `, [msg.username, msg.text, msg.chatroomId]);
    });

    socket.on('joinRoom', (chatroomId) => {
        socket.join(`chatroom-${chatroomId}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected: ', socket.id);
    });
});

// ----- GraphQL Setup -----
const typeDefs = gql`
    scalar Int
    
    type Query {
        messages(chatroomId: Int!): [userMessage!]!
        chatrooms: [Chatroom!]!
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
        chatroomId: Int!
    }

    type Chatroom {
        id: ID!
        name: String!
        description: String
        isPrivate: Boolean
    }
`;

const resolvers = {
    Query : {
        messages: async (_, { chatroomId }) => {
            const result = await pool.query(`
                SELECT username, text, chatroom_id as "chatroomId" 
                FROM chats
                WHERE chatroom_id = $1
                ORDER BY created_at ASC
                `, [chatroomId]); 
            return result.rows;
        },

        chatrooms: async () => {
            const result = await pool.query(`
                SELECT id, name, is_private
                FROM chatrooms
                ORDER BY created_at ASC
                `);
            return result.rows;
        }
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

