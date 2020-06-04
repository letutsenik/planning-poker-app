const createUserService = Users => {
	const addUser = async ({ username = 'unknown', roomId }) => {
		const user = new Users({ name: username.trim(), roomId });

		try {
			await user.save();
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUsers = async () => {
		try {
			const users = await Users.find();
			return { users };
		} catch (error) {
			return { error };
		}
	};
	const removeUser = async userId => {
		try {
			const user = await Users.findOneAndDelete({ _id: userId });
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUser = async userId => {
		try {
			const user = await Users.findById(userId);
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

	return {
		addUser,
		getUsers,
		removeUser,
		getUser,
		updateUser,
		getUsersInRoom,
	};
};

module.exports = {
	createUserService,
};
