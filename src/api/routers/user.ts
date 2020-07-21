import express, { Request, Response } from 'express';
const router = express.Router();

import { User } from '../../models/user';
import { createUserService } from '../../services/users.service';

const userService = createUserService(User);

router.get('/users', async (req: Request, res: Response) => {
	const { error, users } = await userService.getUsers();
	if (error) {
		return res.status(400).send(error);
	}
	res.send(users);
});

router.get('/users/room/:id', async (req: Request, res: Response) => {
	const { error, users } = await userService.getUsersInRoom(req.params.id);
	if (error) {
		return res.status(400).send(error);
	}
	res.send(users);
});

router.get('/users/:id', async (req: Request, res: Response) => {
	const { error, user } = await userService.getUser({ _id: req.params.id });
	if (error) {
		return res.status(500).send(error);
	}
	if (!user) {
		return res
			.status(404)
			.send({ message: `Not found user with id: ${req.params.id}` });
	}
	res.send(user);
});

router.post('/users', async (req: Request, res: Response) => {
	const { error, user } = await userService.addUser(req.body);
	if (error) {
		return res.status(400).send(error);
	}
	res.send(user);
});

router.delete('/users/:id', async (req: Request, res: Response) => {
	const { error, user } = await userService.removeUser({ id: req.params.id });
	if (error) {
		return res.status(500).send(error);
	}
	if (!user) {
		return res.status(404).send({ message: 'Not found' });
	}
	res.send(user);
});

router.patch('/users/:id', async (req: Request, res: Response) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'vote', 'roomId'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update),
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	const { error, user } = await userService.updateUser(
		{ id: req.params.id },
		req.body,
	);
	if (error) {
		return res.status(400).send(error);
	}
	if (!user) {
		return res.status(404).send({ message: 'Not found' });
	}
	return res.send(user);
});

export default router;
