import { FilterQuery } from 'mongoose';
import { Room, RoomModel } from '../models/room';
import { Identifier, ServiceError } from '../types';

type createRoomServiceType = {
	addRoom: (arg: { name: string }) => Promise<ServiceError & { room?: Room }>;
	getRooms: () => Promise<ServiceError & { rooms?: Array<Room> }>;
	getRoomById: (
		roomId: Identifier,
	) => Promise<ServiceError & { room?: Room | null }>;
	removeRoom: (
		conditions: FilterQuery<Room>,
	) => Promise<ServiceError & { room?: Room | null }>;
};

export const createRoomService = (Rooms: RoomModel): createRoomServiceType => {
	const addRoom = async ({
		name,
	}: {
		name: string;
	}): Promise<ServiceError & { room?: Room }> => {
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

	const getRooms = async (): Promise<{
		error?: { message: string };
		rooms?: Array<Room>;
	}> => {
		try {
			const rooms = await Rooms.find();
			return { rooms };
		} catch (error) {
			return { error };
		}
	};

	const getRoomById = async (
		roomId: Identifier,
	): Promise<{ error?: { message: string }; room?: Room | null }> => {
		try {
			const room = await Rooms.findById(roomId);
			return { room };
		} catch (error) {
			return { error };
		}
	};

	const removeRoom = async (
		conditions: FilterQuery<Room>,
	): Promise<{ error?: { message: string }; room?: Room | null }> => {
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
