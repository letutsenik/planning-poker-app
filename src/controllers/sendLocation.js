const { User } = require('../models/user');
const { createUserService } = require('../services/users.service');

const userService = createUserService(User);

const { generateLocationMessage } = require('../services/messages');

const createSendLocationController = (io, socket) => {
	return async (coords, callback) => {
		const { error, user } = await userService.getUser({ socketId: socket.id });
		if (error) {
			return callback(error);
		}

		io.to(user.roomId).emit(
			'locationMessage',
			generateLocationMessage(
				user.name,
				`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
			),
		);
		callback();
	};
};

module.exports = {
	createSendLocationController,
};
