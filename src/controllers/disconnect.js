const { User } = require('../models/user');
const { Room } = require('../models/room');

const { createUserService } = require('../services/users.service');
const { createRoomService } = require('../services/rooms.service');

const { generateMessage } = require('../services/messages.service');

const userService = createUserService(User);
const roomService = createRoomService(Room);

const createDisconnectController = (io, socket) => {
	return async (options, callback) => {
		console.log('===disconnect===');
		const { error, user } = await userService.removeUser({
			socketId: socket.id,
		});

		if (!user) return;

		if (error) {
			return callback(error);
		}
		const { roomId } = user;

		if (user) {
			io.to(roomId).emit(
				'message',
				generateMessage('Admin', `${user.name} has left!`),
			);

			const { users: usersInRoom } = await userService.getUsersInRoom(roomId); //TODO:  Handle Error

			io.to(user.roomId).emit('roomData', {
				users: usersInRoom,
			});
		}

		const { getUsersInRoomError, users } = await userService.getUsersInRoom(
			roomId,
		);

		if (getUsersInRoomError) {
			return callback(getUsersInRoomError);
		}

		if (users.length === 0) {
			const { error } = await roomService.removeRoom({ _id: roomId });
			if (error) {
				return callback(error);
			}
		}
	};
};

module.exports = {
	createDisconnectController,
};
