import { ControllerCallBackType } from '../types';
import { Server } from 'socket.io';

import { Room } from '../models/room';
import { createRoomService } from '../services/rooms.service';

const roomService = createRoomService(Room);

interface InitJoinControllerOptions {}

export const createInitJoinController = (socket: Server) => {
	return async (
		options: InitJoinControllerOptions,
		callback: ControllerCallBackType,
	) => {
		const { error, rooms } = await roomService.getRooms();
		if (error) {
			return callback(error);
		}
		socket.emit('sendRooms', rooms);
	};
};
