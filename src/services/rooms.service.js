const createRoomService = Rooms => {
	const addRoom = async ({ name }) => {
		const room = new Rooms({ name: name.trim() });

		try {
			await room.save();
			return { room };
		} catch (error) {
			return { error };
		}
	};
	const getRooms = async () => {
		try {
			const rooms = await Rooms.find();
			return { rooms };
		} catch (error) {
			return { error };
		}
	};

	const getRoomById = async roomId => {
		try {
			const room = await Rooms.getById(roomId);
			return { room };
		} catch (error) {
			return { error };
		}
	};

	const addUserToRoom = () => {};
	const removeUserFromRoom = () => {};

	return {
		addRoom,
		getRooms,
		getRoomById,

		addUserToRoom,
		removeUserFromRoom,
	};
};

module.exports = {
	createRoomService,
};
