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
	const removeUser = async userId => {
		try {
			const user = await Users.findOneAndDelete(userId);
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUser = async userId => {
		try {
			const user = await Users.getById(userId);
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
		removeUser,
		getUser,
		getUsersInRoom,
	};
};

module.exports = {
	createUserService,
};
