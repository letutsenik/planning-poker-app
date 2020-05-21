const { getUser } = require('../services/users');
const { clearVotesByRoom } = require('../services/votes');

const createClearVoteController = (io, socket) => {
	return (points, callback) => {
		const user = getUser(socket.id);
		clearVotesByRoom(user); //TODO use return

		io.to(user.roomId).emit('voteListUpdate', []);
		callback();
	};
};

module.exports = {
	createClearVoteController,
};
