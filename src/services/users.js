const users = [
	{
		id: 1111,
		username: 'John',
		roomId: 'Default',
	},
];

const addUser = ({id, username = 'unknown', roomId}) => {
	// Clean the data
	username = username.trim();

	// Validate the data
	if (!username || !roomId) {
		return {
			error: 'Username and roomId are required!',
		};
	}

	// Check for existing user
	const existingUser = users.find(user => {
		return user.roomId === roomId && user.username === username;
	});

	// Validate username
	if (existingUser) {
		return {
			error: 'Username is in use!',
		};
	}

	// Store user
	const user = {id, username, roomId};
	users.push(user);
	return {user};
};

const removeUser = id => {
	const index = users.findIndex(user => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

const getUser = id => {
	return users.find(user => user.id === id);
};

const getUsersInRoom = roomId => {
	return users.filter(user => user.roomId === roomId);
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};
