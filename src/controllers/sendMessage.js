const Filter = require('bad-words');
const { generateMessage } = require('../services/messages');
const { getUser } = require('../services/users');

const createSendMessageController = (io, socket) => {
	return (message, callback) => {
		console.log('socket', socket.id);
		const user = getUser(socket.id);

		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed!');
		}

		io.to(user.roomId).emit('message', generateMessage(user.username, message));
		callback();
	};
};

module.exports = {
	createSendMessageController,
};
