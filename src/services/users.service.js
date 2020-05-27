const createUserService = Users => {
	const addUser = ({ username = 'unknown', roomId }) => {};
	const removeUser = (userId) => {};
	const getUser = (userId) => {};
	const getUsersInRoom = (roomId) => {};

	return {
		addUser,
		removeUser,
		getUser,
		getUsersInRoom
	}
};

module.exports = {
	createUserService
};
