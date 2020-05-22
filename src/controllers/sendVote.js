const { statsCount } = require('../utils');
const { getRoomById } = require('../services/rooms');
const { getVoteByRoom } = require('../services/votes');
const { addVote } = require('../services/votes');
const { getUser } = require('../services/users');

const createSendVoteController = (io, socket) => {
	return (points, callback) => {
		const user = getUser(socket.id);
		addVote(user, points);
		const voteData = getVoteByRoom(user);
		const { room: currentRoom } = getRoomById(user.roomId);
		const showVotes = voteData.length === currentRoom.users.length;
		const stats = showVotes
			? statsCount(voteData.map(item => item.vote))
			: null;

		io.to(user.roomId).emit('voteListUpdate', { voteData, showVotes, stats });
		callback();
	};
};

module.exports = {
	createSendVoteController,
};
