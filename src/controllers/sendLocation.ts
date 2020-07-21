import { generateLocationMessage } from '../services/messages.service';
import { Server, Socket } from 'socket.io';
import { User } from '../models/user';
import { createUserService } from '../services/users.service';
import { ControllerCallBackType } from '../types';

const userService = createUserService(User);

interface SendLocationControllerOptions {
	coords: {
		latitude: number;
		longitude: number;
	};
}

export const createSendLocationController = (io: Server, socket: Socket) => {
	return async (
		options: SendLocationControllerOptions,
		callback: ControllerCallBackType,
	): Promise<void> => {
		const { error, user } = await userService.getUser({ socketId: socket.id });
		if (error) {
			return callback(error);
		}

		io.to(String(user?.roomId)).emit(
			'locationMessage',
			generateLocationMessage(
				user?.name || 'unknown',
				`https://google.com/maps?q=${options.coords.latitude},${options.coords.longitude}`,
			),
		);
		callback();
	};
};
