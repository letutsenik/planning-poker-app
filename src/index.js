const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./services/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./services/users');
const { getRooms, addRoom, addUserToRoom, getRoomById } = require('./services/rooms');
const { addVote, getVoteByRoom, clearVotesByRoom } = require('./services/votes');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('initJoin', (options, callback) => {
        socket.emit('sendRooms', getRooms());
    });

    socket.on('join', (options, callback) => {
        let { error: roomError, room } = addRoom({ roomName: options.roomName });
        if (roomError) {
            return callback(roomError)
        }

        let { error, user } = addUser({ id: socket.id, roomId: room.id, ...options });

        if (error) {
            return callback(error)
        }
        const updatedRoom = addUserToRoom(room.id, user);

        socket.join(user.roomId);

        socket.emit('message', generateMessage('Admin','Welcome!'));
        socket.broadcast.to(user.roomId).emit('message', generateMessage('Admin', `${user.username} has joined!`));
        io.to(user.roomId).emit('roomData', {
            room: getRoomById(user.roomId).name,
            users: getUsersInRoom(user.roomId)
        });
        io.to(user.roomId).emit('voteListUpdate', { voteData: getVoteByRoom(user), showVotes: false });

        callback()
    });

    socket.on('sendMessage', (message, callback) => {
        console.log('socket', socket.id)
        const user = getUser(socket.id);

        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.roomId).emit('message', generateMessage(user.username, message));
        callback()
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.roomId).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback()
    });

    socket.on('sendVote', (points, callback) => {
        const user = getUser(socket.id);
        addVote(user, points);
        const voteData = getVoteByRoom(user);
        const currentRoom = getRoomById(user.roomId);
        const showVotes = voteData.length === currentRoom.users.length;

        io.to(user.roomId).emit('voteListUpdate', { voteData, showVotes });
        callback()
    });

    socket.on('clearVotes', (points, callback) => {
        const user = getUser(socket.id);
        clearVotesByRoom(user); //TODO use return

        io.to(user.roomId).emit('voteListUpdate', []);
        callback()
    });

    socket.on('showVotes', (points, callback) => {
        const user = getUser(socket.id);

        io.to(user.roomId).emit('voteListUpdate', { voteData: getVoteByRoom(user), showVotes: true });
        callback()
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.roomId).emit('message', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.roomId).emit('roomData', {
                room: getRoomById(user.roomId).name,
                users: getUsersInRoom(user.roomId)
            })
        }
    })
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
});
