import { FilterQuery } from 'mongoose';
import { Room, RoomModel } from '../models/room';

export const createRoomService = (Rooms: RoomModel) => {
	const addRoom = async ({
		name,
	}: {
		name: string;
	}): Promise<{ error?: any; room?: Room }> => {
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

	const getRoomById = async (roomId: number) => {
		try {
			const room = await Rooms.findById(roomId);
			return { room };
		} catch (error) {
			return { error };
		}
	};

	const removeRoom = async (conditions: FilterQuery<Room>) => {
		try {
			const room = await Rooms.findOneAndDelete(conditions);
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
