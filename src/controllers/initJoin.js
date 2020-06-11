const { Room } = require('../models/room');
const { createRoomService } = require('../services/rooms.service');

const roomService = createRoomService(Room);

const createInitJoinController = socket => {
	return async (options, callback) => {
		const { error, rooms } = await roomService.getRooms();
		if (error) {
			return callback(error);
		}
		socket.emit('sendRooms', rooms);
	};
};

module.exports = {
	createInitJoinController,
};

//Old:
//const { getRooms } = require('../services/rooms');
//
// const createInitJoinController = socket => {
// 	return (options, callback) => {
// 		const { error, rooms } = getRooms();
// 		if (error) {
// 			return callback(error);
// 		}
// 		socket.emit('sendRooms', rooms);
// 	};
// };
//
// module.exports = {
// 	createInitJoinController,
// };
