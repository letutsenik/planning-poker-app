const { generateMessage } = require('../services/messages');
const { Room } = require('../models/room');
const { User } = require('../models/user');
const { createRoomService } = require('../services/rooms.service');
const { createUserService } = require('../services/users.service');

const userService = createUserService(User);
const roomService = createRoomService(Room);

const createJoinController = (io, socket) => {
	return async (options, callback) => {
		let { error: roomError, room } = await roomService.addRoom({
			name: options.roomName,
		});
		if (roomError) {
			return callback(roomError);
		}

		let { error: getUsersError, users } = await userService.getUsersInRoom(
			room._id,
		);
		if (getUsersError) {
			return callback(getUsersError);
		}
		if (users.find(user => user.name === options.username)) {
			return callback('Username is in use!');
		}

		let { error, user } = await userService.addUser({
			socketId: socket.id,
			roomId: room._id,
			username: options.username,
		});

		if (error) {
			return callback(error);
		}

		socket.join(user.roomId);

		socket.emit('message', generateMessage('Admin', 'Welcome!'));
		socket.broadcast
			.to(user.roomId)
			.emit('message', generateMessage('Admin', `${user.name} has joined!`));
		const { users: usersInRoom } = await userService.getUsersInRoom(
			user.roomId,
		); //TODO:  Handle Error
		io.to(user.roomId).emit('roomData', {
			room: room.name, // TODO: Replace with id
			users: usersInRoom,
		});

		const { errorVoteData, voteData } = await userService.getVoteByRoom(
			user.roomId,
		);
		if (errorVoteData) {
			return callback(errorVoteData);
		}
		io.to(user.roomId).emit('voteListUpdate', {
			voteData,
			showVotes: false,
		});

		callback();
	};
};

module.exports = {
	createJoinController,
};
