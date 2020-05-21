const { generateLocationMessage } = require('../services/messages');
const { getUser } = require('../services/users');

const createSendLocationController = (io, socket) => {
	return (coords, callback) => {
		const user = getUser(socket.id);
		io.to(user.roomId).emit(
			'locationMessage',
			generateLocationMessage(
				user.username,
				`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
			),
		);
		callback();
	};
};

module.exports = {
	createSendLocationController,
};
