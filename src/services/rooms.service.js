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
			const room = await Rooms.findById(roomId);
			return { room };
		} catch (error) {
			return { error };
		}
	};

	return {
		addRoom,
		getRooms,
		getRoomById,
	};
};

module.exports = {
	createRoomService,
};
