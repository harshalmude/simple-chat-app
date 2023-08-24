const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
const users = {};

// Store chat history
const chatHistory = [];

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for user login
    socket.on('login', (username) => {
        users[socket.id] = username;
        io.emit('user list', Object.values(users));
        // Send chat history to the new user
        socket.emit('chat history', chatHistory);
    });

    // Listen for messages from the client
    socket.on('chat message', (message) => {
        const username = users[socket.id];
        const formattedMessage = `${username}: ${message}`;
        chatHistory.push(formattedMessage);
        io.emit('chat message', formattedMessage);
    });

    // Listen for disconnect
    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('user list', Object.values(users));
        console.log(`${username} disconnected`);
    });
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
