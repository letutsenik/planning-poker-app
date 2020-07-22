import http from 'http';
import socketio from 'socket.io';
import chalk from 'chalk';
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
import {
	createInitJoinController,
	createJoinController,
	createSendMessageController,
	createSendLocationController,
	createSendVoteController,
	createClearVoteController,
	createShowVotesController,
	createDisconnectController,
} from './controllers';

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;

io.on(CONNECTION, socket => {
	console.log('New WebSocket connection');

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	socket.on(INIT_JOIN, createInitJoinController(socket));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	socket.on(JOIN, createJoinController(io, socket));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	socket.on(SEND_MESSAGE, createSendMessageController(io, socket));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	socket.on(SEND_LOCATION, createSendLocationController(io, socket));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	socket.on(SEND_VOTE, createSendVoteController(io, socket));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	socket.on(CLEAR_VOTE, createClearVoteController(io, socket));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	socket.on(SHOW_VOTES, createShowVotesController(io, socket));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	socket.on(DISCONNECT, createDisconnectController(io, socket));
});

server.listen(port, () => {
	console.log(
		`Server is up ${chalk.green.bold('successfully')} on port ${chalk.blue.bold(
			port,
		)}`,
	);
});
