const express = require('express');
const router = new express.Router();

const { User } = require('../../models/user');
const { createUserService } = require('../../services/users.service');

const userService = createUserService(User);

router.get('/users', async (req, res) => {
	const { error, users } = await userService.getUsers();
	if (error) {
		return res.status(400).send(error);
	}
	res.send(users);
});

router.get('/users/:id', async (req, res) => {
	const { error, user } = await userService.getUser(req.params.id);
	if (error) {
		return res.status(500).send(error);
	}
	if (!user) {
		return res.status(404).send({ message: 'Not found' });
	}
	res.send(user);
});

router.post('/users', async (req, res) => {
	const { error, user } = await userService.addUser(req.body);
	if (error) {
		return res.status(400).send(error);
	}
	res.send(user);
});

router.delete('/users/:id', async (req, res) => {
	const { error, user } = await userService.removeUser(req.params.id);
	if (error) {
		return res.status(500).send(error);
	}
	if (!user) {
		return res.status(404).send({ message: 'Not found' });
	}
	res.send(user);
});

router.patch('/users/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'vote'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update),
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	const { error, user } = await userService.updateUser(req.params.id, req.body);
	if (error) {
		return res.status(400).send(error);
	}
	if (!user) {
		return res.status(404).send({ message: 'Not found' });
	}
	return res.send(user);
});

module.exports = router;
