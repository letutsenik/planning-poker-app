const { User } = require('../models/user');
const { createUserService } = require('../services/users.service');

const { generateMessage } = require('../services/messages');

const userService = createUserService(User);

const createDisconnectController = (io, socket) => {
	return async (options, callback) => {
		console.log('===disconnect===');
		const { error, user } = await userService.removeUser({
			socketId: socket.id,
		});

		if (error) {
			return callback(error);
		}

		if (user) {
			io.to(user.roomId).emit(
				'message',
				generateMessage('Admin', `${user.name} has left!`),
			);

			const { users: usersInRoom } = await userService.getUsersInRoom(
				user.roomId,
			); //TODO:  Handle Error

			io.to(user.roomId).emit('roomData', {
				users: usersInRoom,
			});
		}
	};
};

module.exports = {
	createDisconnectController,
};

//const { getUsersInRoom } = require('../services/users');
// const { getRoomById } = require('../services/rooms');
// const { generateMessage } = require('../services/messages');
// const { removeUserFromRoom } = require('../services/rooms');
// const { removeUser } = require('../services/users');
//
// const createDisconnectController = (io, socket) => {
// 	return () => {
// 		const user = removeUser(socket.id);
// 		if (user) {
// 			removeUserFromRoom(user.roomId, user.id);
// 		}
//
// 		if (user) {
// 			io.to(user.roomId).emit(
// 				'message',
// 				generateMessage('Admin', `${user.username} has left!`),
// 			);
// 			io.to(user.roomId).emit('roomData', {
// 				room: getRoomById(user.roomId).room.name,
// 				users: getUsersInRoom(user.roomId),
// 			});
// 		}
// 	};
// };
