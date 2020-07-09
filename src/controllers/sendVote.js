const { User } = require('../models/user');
const { createUserService } = require('../services/users.service');

const userService = createUserService(User);

const { statsCount } = require('../utils');

const createSendVoteController = (io, socket) => {
	return async (points, callback) => {
		const { error, user } = await userService.updateUser(
			{ socketId: socket.id },
			{ vote: points },
		);
		if (error) {
			return callback(error);
		}
		const { errorVoteData, voteData } = await userService.getVoteByRoom(
			user.roomId,
		);
		if (errorVoteData) {
			return callback(errorVoteData);
		}

		const {
			error: errorUsersInRoom,
			users: usersInRoom,
		} = await userService.getUsersInRoom(user.roomId);
		if (errorUsersInRoom) {
			return callback(errorVoteData);
		}

		const showVotes = voteData.length === usersInRoom.length;
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
