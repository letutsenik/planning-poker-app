const { statsCount } = require('../utils');
const { getVoteByRoom } = require('../services/votes');
const { getUser } = require('../services/users');

const createShowVotesController = (io, socket) => {
	return (points, callback) => {
		const user = getUser(socket.id);

		const voteData = getVoteByRoom(user);
		const stats = statsCount(voteData.map(item => item.vote));

		io.to(user.roomId).emit('voteListUpdate', {
			voteData: getVoteByRoom(user),
			showVotes: true,
			stats,
		});
		callback();
	};
};

module.exports = {
	createShowVotesController,
};
