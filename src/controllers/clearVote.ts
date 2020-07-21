import { User } from '../models/user';
import { createUserService } from '../services/users.service';
import { Server, Socket } from 'socket.io';
import { SendVoteControllerOptions } from './sendVote';
import { ControllerCallBackType } from '../types';

const userService = createUserService(User);

export const createClearVoteController = (io: Server, socket: Socket) => {
	return async (
		options: SendVoteControllerOptions,
		callback: ControllerCallBackType,
	): Promise<void> => {
		const { error, user } = await userService.getUser({ socketId: socket.id });
		if (error) {
			return callback(error);
		}
		const { error: clearVotesError } = await userService.clearVotesByRoom(
			String(user?.roomId),
		);
		if (clearVotesError) {
			return callback(clearVotesError);
		}
		io.to(String(user?.roomId)).emit('voteListUpdate', {
			voteData: [],
		});
		callback();
	};
};
