const { getRooms } = require('../services/rooms');

const createInitJoinController = socket => {
	return () => {
		socket.emit('sendRooms', getRooms());
	};
};

module.exports = {
	createInitJoinController,
};
