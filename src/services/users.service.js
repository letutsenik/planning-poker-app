const createUserService = Users => {
	const addUser = async ({ username = 'unknown', roomId, socketId }) => {
		const user = new Users({ name: username.trim(), roomId, socketId });

		try {
			await user.save();
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUsers = async options => {
		try {
			const users = await Users.find(options);
			return { users };
		} catch (error) {
			return { error };
		}
	};
	const removeUser = async options => {
		try {
			const user = await Users.findOneAndDelete(options);
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUserById = async userId => {
		try {
			const user = await Users.findById(userId);
			return { user };
		} catch (error) {
			return { error };
		}
	};

	const getUser = async options => {
		try {
			const user = await Users.findOne(options);
			return { user };
		} catch (error) {
			return { error };
		}
	};

	const updateUser = async (userId, options) => {
		try {
			const user = await Users.findOneAndUpdate({ _id: userId }, options, {
				new: true,
			});
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUsersInRoom = async roomId => {
		try {
			const users = await Users.find({ roomId });
			return { users };
		} catch (error) {
			return { error };
		}
	};

	const getVoteByRoom = async roomId => {
		try {
			const users = await Users.find({ roomId });
			const voteData = users.map(user => ({
				user: user.name,
				vote: user.vote,
			}));
			return { voteData };
		} catch (error) {
			return { error };
		}
	};

	return {
		addUser,
		getUsers,
		removeUser,
		getUserById,
		getUser,
		updateUser,
		getUsersInRoom,
		getVoteByRoom,
	};
};

module.exports = {
	createUserService,
};
