import http from 'http';
import socketio from 'socket.io';
import app from './app';
import {
	CONNECTION,
	INIT_JOIN,
	JOIN,
	SEND_MESSAGE,
	SEND_LOCATION,
	SEND_VOTE,
	CLEAR_VOTE,
	SHOW_VOTES,
	DISCONNECT,
} from './constants';
const {
	createInitJoinController,
	createJoinController,
	createSendMessageController,
	createSendLocationController,
	createSendVoteController,
	createClearVoteController,
	createShowVotesController,
	createDisconnectController,
} = require('./controllers');

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;

io.on(CONNECTION, socket => {
	console.log('New WebSocket connection');

	socket.on(INIT_JOIN, createInitJoinController(socket));

	socket.on(JOIN, createJoinController(io, socket));

	socket.on(SEND_MESSAGE, createSendMessageController(io, socket));

	socket.on(SEND_LOCATION, createSendLocationController(io, socket));

	socket.on(SEND_VOTE, createSendVoteController(io, socket));

	socket.on(CLEAR_VOTE, createClearVoteController(io, socket));

	socket.on(SHOW_VOTES, createShowVotesController(io, socket));

	socket.on(DISCONNECT, createDisconnectController(io, socket));
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});
