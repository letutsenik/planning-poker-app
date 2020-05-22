const { getRooms } = require('../services/rooms');

const createInitJoinController = socket => {
	return (options, callback) => {
		const { error, rooms } = getRooms();
		if (error) {
			return callback(error);
		}
		socket.emit('sendRooms', rooms);
	};
};

module.exports = {
	createInitJoinController,
};
