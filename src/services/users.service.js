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

	const updateUser = async (searchOptions, options) => {
		try {
			const user = await Users.findOneAndUpdate(searchOptions, options, {
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
			const voteData = users.reduce((data, user) => {
				return user.vote
					? [
							...data,
							{
								user: user.name,
								vote: user.vote,
							},
					  ]
					: [...data];
			}, []);

			return { voteData };
		} catch (error) {
			return { error };
		}
	};

	const clearVotesByRoom = async roomId => {
		try {
			const res = await Users.updateMany({ roomId }, { vote: null });
			return { res };
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
		clearVotesByRoom,
	};
};

module.exports = {
	createUserService,
};
