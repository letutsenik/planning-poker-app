import { ControllerCallBackType } from '../types';
import { Server, Socket } from 'socket.io';

import { User } from '../models/user';
import { Room } from '../models/room';

import { createUserService } from '../services/users.service';
import { createRoomService } from '../services/rooms.service';

import { generateMessage } from '../services/messages.service';

const userService = createUserService(User);
const roomService = createRoomService(Room);

export const createDisconnectController = (io: Server, socket: Socket) => {
	return async (
		options: { [key: string]: string },
		callback: ControllerCallBackType,
	): Promise<void> => {
		console.log('===disconnect===');
		const { error, user } = await userService.removeUser({
			socketId: socket.id,
		});

		if (!user) return;

		if (error) {
			return callback(error);
		}
		const { roomId } = user;

		if (user) {
			io.to(String(roomId)).emit(
				'message',
				generateMessage('Admin', `${user.name} has left!`),
			);

			const { users: usersInRoom } = await userService.getUsersInRoom(roomId); //TODO:  Handle Error

			io.to(String(user.roomId)).emit('roomData', {
				users: usersInRoom,
			});
		}

		const {
			error: getUsersInRoomError,
			users,
		} = await userService.getUsersInRoom(roomId);

		if (getUsersInRoomError) {
			return callback(getUsersInRoomError);
		}

		if (users?.length === 0) {
			const { error } = await roomService.removeRoom({ _id: roomId });
			if (error) {
				return callback(error);
			}
		}
	};
};
