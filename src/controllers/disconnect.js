const { getUsersInRoom } = require('../services/users');
const { getRoomById } = require('../services/rooms');
const { generateMessage } = require('../services/messages');
const { removeUserFromRoom } = require('../services/rooms');
const { removeUser } = require('../services/users');

const createDisconnectController = (io, socket) => {
	return () => {
		const user = removeUser(socket.id);
		if (user) {
			removeUserFromRoom(user.roomId, user.id);
		}

		if (user) {
			io.to(user.roomId).emit(
				'message',
				generateMessage('Admin', `${user.username} has left!`),
			);
			io.to(user.roomId).emit('roomData', {
				room: getRoomById(user.roomId).name,
				users: getUsersInRoom(user.roomId),
			});
		}
	};
};

module.exports = {
	createDisconnectController,
};
