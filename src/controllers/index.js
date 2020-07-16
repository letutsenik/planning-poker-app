import { createInitJoinController } from './initJoin';
const { createJoinController } = require('./join');
const { createSendMessageController } = require('./sendMessage');
const { createSendLocationController } = require('./sendLocation');
const { createSendVoteController } = require('./sendVote');
const { createClearVoteController } = require('./clearVote');
const { createShowVotesController } = require('./showVotes');
const { createDisconnectController } = require('./disconnect');

module.exports = {
	createInitJoinController,
	createJoinController,
	createSendMessageController,
	createSendLocationController,
	createSendVoteController,
	createClearVoteController,
	createShowVotesController,
	createDisconnectController,
};
