import { ControllerCallBackType } from '../types';
import { Server, Socket } from 'socket.io';

import { generateMessage } from '../services/messages.service';
import { Room } from '../models/room';
import { User } from '../models/user';
import { createRoomService } from '../services/rooms.service';
import { createUserService } from '../services/users.service';

const userService = createUserService(User);
const roomService = createRoomService(Room);

interface JoinControllerOptions {
	roomName: string;
	username: string;
}

export const createJoinController = (io: Server, socket: Socket) => {
	return async (
		options: JoinControllerOptions,
		callback: ControllerCallBackType,
	): Promise<void> => {
		const { error: roomError, room } = await roomService.addRoom({
			name: options.roomName,
		});
		if (roomError) {
			return callback(roomError);
		}

		const { error: getUsersError, users } = await userService.getUsersInRoom(
			room?._id,
		);
		if (getUsersError) {
			return callback(getUsersError);
		}
		if (users && users.find(user => user.name === options.username)) {
			return callback('Username is in use!');
		}

		const { error, user } = await userService.addUser({
			socketId: socket.id,
			roomId: room?._id,
			name: options.username,
		});

		if (error) {
			return callback(error);
		}

		socket.join(String(user?.roomId));

		socket.emit('message', generateMessage('Admin', 'Welcome!'));
		socket.broadcast
			.to(String(user?.roomId))
			.emit('message', generateMessage('Admin', `${user?.name} has joined!`));
		const { users: usersInRoom } = await userService.getUsersInRoom(
			String(user?.roomId),
		); //TODO:  Handle Error
		io.to(String(user?.roomId)).emit('roomData', {
			room: room?.name, // TODO: Replace with id
			users: usersInRoom,
		});

		const { error: errorVoteData, voteData } = await userService.getVoteByRoom(
			String(user?.roomId),
		);
		if (errorVoteData) {
			return callback(errorVoteData);
		}
		io.to(String(user?.roomId)).emit('voteListUpdate', {
			voteData,
			showVotes: false,
		});

		callback();
	};
};

module.exports = {
	createJoinController,
};
