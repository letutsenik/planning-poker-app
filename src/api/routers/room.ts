import express, { Request, Response } from 'express';
const router = express.Router();

import { Room } from '../../models/room';
import { createRoomService } from '../../services/rooms.service';
import { User } from '../../models/user';
import { createUserService } from '../../services/users.service';

const roomService = createRoomService(Room);
const userService = createUserService(User);

router.get('/rooms', async (req: Request, res: Response) => {
	const { error, rooms } = await roomService.getRooms();
	if (error) {
		return res.status(400).send(error);
	}
	res.send(rooms);
});

router.get('/rooms/:id', async (req: Request, res: Response) => {
	const { error, room } = await roomService.getRoomById(req.params.id);
	if (error) {
		return res.status(500).send(error);
	}
	if (!room) {
		return res
			.status(404)
			.send({ message: `Not found room with id: ${req.params.id}` });
	}
	res.send(room);
});

router.post('/rooms', async (req: Request, res: Response) => {
	const { error, room } = await roomService.addRoom(req.body);
	if (error) {
		return res.status(400).send(error);
	}
	res.send(room);
});

router.get('/rooms/:id/user-votes', async (req: Request, res: Response) => {
	const { error, room } = await roomService.getRoomById(req.params.id);
	if (error) {
		return res.status(500).send(error);
	}
	if (!room) {
		return res
			.status(404)
			.send({ message: `Not found room with id: ${req.params.id}` });
	}

	const { error: voteError, voteData } = await userService.getVoteByRoom(
		req.params.id,
	);
	if (voteError) {
		return res.status(400).send(voteError);
	}
	res.send(voteData);
});

export default router;
