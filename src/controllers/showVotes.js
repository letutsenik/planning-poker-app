const { User } = require('../models/user');
const { createUserService } = require('../services/users.service');

const userService = createUserService(User);

const { statsCount } = require('../utils');

const createShowVotesController = (io, socket) => {
	return async (points, callback) => {
		const { error, user } = await userService.getUser({ socketId: socket.id });
		if (error) {
			return callback(error);
		}

		const { errorVoteData, voteData } = await userService.getVoteByRoom(
			user.roomId,
		);
		if (errorVoteData) {
			return callback(errorVoteData);
		}

		const stats = statsCount(voteData.map(item => item.vote));

		io.to(user.roomId).emit('voteListUpdate', {
			voteData,
			showVotes: true,
			stats,
		});
		callback();
	};
};

//const createShowVotesController = (io, socket) => {
// 	return (points, callback) => {
// 		const user = getUser(socket.id);
//
// 		const voteData = getVoteByRoom(user);
// 		const stats = statsCount(voteData.map(item => item.vote));
//
// 		io.to(user.roomId).emit('voteListUpdate', {
// 			voteData: getVoteByRoom(user),
// 			showVotes: true,
// 			stats,
// 		});
// 		callback();
// 	};
// };

module.exports = {
	createShowVotesController,
};
