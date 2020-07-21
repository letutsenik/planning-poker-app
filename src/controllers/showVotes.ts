import { User } from '../models/user';
import { createUserService } from '../services/users.service';
import { statsCount } from '../utils';
import { Server, Socket } from 'socket.io';
import { ControllerCallBackType } from '../types';
import { SendVoteControllerOptions } from './sendVote';

const userService = createUserService(User);

export const createShowVotesController = (io: Server, socket: Socket) => {
	return async (
		options: SendVoteControllerOptions,
		callback: ControllerCallBackType,
	): Promise<void> => {
		const { error, user } = await userService.getUser({ socketId: socket.id });
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

		const stats = statsCount(
			voteData.reduce((acc: Array<number>, item: { vote?: number | null }) => {
				return item.vote ? [...acc, item.vote] : [...acc];
			}, []),
		);

		io.to(String(user?.roomId)).emit('voteListUpdate', {
			voteData,
			showVotes: true,
			stats,
		});
		callback();
	};
};
