import { ControllerCallBackType } from '../types';
import { Socket } from 'socket.io';

import { Room } from '../models/room';
import { createRoomService } from '../services/rooms.service';

const roomService = createRoomService(Room);

export const createInitJoinController = (socket: Socket) => {
	return async (
		options: { [key: string]: string },
		callback: ControllerCallBackType,
	): Promise<void> => {
		const { error, rooms } = await roomService.getRooms();
		if (error) {
			return callback(error);
		}
		socket.emit('sendRooms', rooms);
	};
};
