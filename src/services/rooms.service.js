const createRoomService = Rooms => {
	const addRoom = async ({ name }) => {
		const roomsWithSameName = await Rooms.find({ name });
		if (roomsWithSameName.length > 0) return { room: roomsWithSameName[0] };

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

	const removeRoom = async options => {
		try {
			const room = await Rooms.findOneAndDelete(options);
			return { room };
		} catch (error) {
			return { error };
		}
	};

	return {
		addRoom,
		getRooms,
		getRoomById,
		removeRoom,
	};
};

module.exports = {
	createRoomService,
};
