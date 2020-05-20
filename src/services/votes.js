const votes = {};

const addVote = (user, vote) => {
	const currentVotes = votes[user.room] || {};
	votes[user.room] = {
		...currentVotes,
		[user.username]: vote,
	};
	return votes;
};

const getVoteByRoom = user => {
	const currentUserRoomVotes = votes[user.room] || {};
	return Object.keys(currentUserRoomVotes).map(username => ({
		user: username,
		vote: currentUserRoomVotes[username],
	}));
};

const clearVotesByRoom = user => {
	delete votes[user.room];
	return votes;
};

module.exports = {
	addVote,
	getVoteByRoom,
	clearVotesByRoom,
};
