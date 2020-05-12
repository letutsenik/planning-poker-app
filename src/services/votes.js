const votes = {

};

const addVote = (user, vote) => {
    const currentVotes = votes[user.room] || [];
    votes[user.room] = [
        ...currentVotes, { user: user.username, vote }
    ];
    return votes;
};

const getVoteByRoom = (user) => {
    return votes[user.room] || [];
};

const clearVotesByRoom = (user) => {
  delete votes[user.room];
  return votes;
};

module.exports = {
    addVote,
    getVoteByRoom,
    clearVotesByRoom,
};
