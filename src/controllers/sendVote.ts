import { User } from '../models/user';
import { createUserService } from '../services/users.service';

import { statsCount } from '../utils';

import { Server, Socket } from 'socket.io';
import { ControllerCallBackType } from '../types';

const userService = createUserService(User);

export interface SendVoteControllerOptions {
	points: number;
}
export const createSendVoteController = (io: Server, socket: Socket) => {
	return async (
		options: SendVoteControllerOptions,
		callback: ControllerCallBackType,
	) => {
		const { error, user } = await userService.updateUser(
			{ socketId: socket.id },
			{ vote: options.points },
		);
		if (error) {
			return callback(error);
		}
		const {
			error: errorVoteData,
			voteData = [],
		} = await userService.getVoteByRoom(String(user?.roomId));
		if (errorVoteData) {
			return callback(errorVoteData);
		}

		const {
			error: errorUsersInRoom,
			users: usersInRoom,
		} = await userService.getUsersInRoom(String(user?.roomId));
		if (errorUsersInRoom) {
			return callback(errorVoteData);
		}

		const showVotes = voteData.length === usersInRoom?.length;
		const stats = showVotes
			? statsCount(
					voteData.reduce(
						(acc: Array<number>, item: { vote?: number | null }) => {
							return item.vote ? [...acc, item.vote] : [...acc];
						},
						[],
					),
			  )
			: null;

		io.to(String(user?.roomId)).emit('voteListUpdate', {
			voteData,
			showVotes,
			stats,
		});
		callback();
	};
};
