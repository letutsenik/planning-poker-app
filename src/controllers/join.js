const { getVoteByRoom } = require('../services/votes');
const { getUsersInRoom } = require('../services/users');
const { getRoomById } = require('../services/rooms');
const { generateMessage } = require('../services/messages');
const { addUserToRoom } = require('../services/rooms');
const { addUser } = require('../services/users');
const { addRoom } = require('../services/rooms');

const createJoinController = (io, socket) => {
	return (options, callback) => {
		let { error: roomError, room } = addRoom({ roomName: options.roomName });
		if (roomError) {
			return callback(roomError);
		}

		let { error, user } = addUser({
			id: socket.id,
			roomId: room.id,
			...options,
		});

		if (error) {
			return callback(error);
		}
		addUserToRoom(room.id, user); //TODO: use return

		socket.join(user.roomId);

		socket.emit('message', generateMessage('Admin', 'Welcome!'));
		socket.broadcast
			.to(user.roomId)
			.emit(
				'message',
				generateMessage('Admin', `${user.username} has joined!`),
			);
		io.to(user.roomId).emit('roomData', {
			room: getRoomById(user.roomId).name,
			users: getUsersInRoom(user.roomId),
		});
		io.to(user.roomId).emit('voteListUpdate', {
			voteData: getVoteByRoom(user),
			showVotes: false,
		});

		callback();
	};
};

module.exports = {
	createJoinController,
};
