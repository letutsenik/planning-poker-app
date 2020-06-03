const express = require('express');
const router = new express.Router();

const { User } = require('../../models/user');
const { createUserService } = require('../../services/users.service');

const userService = createUserService(User);

router.get('/users', async (req, res) => {
	res.send({ message: 'User List' });
	// res.status(404).send()
});

router.post('/users', async (req, res) => {
	const { error, user } = await userService.addUser(req.body);
	if (error) {
		res.status(400).send(error);
	}
	res.send(user);
});

module.exports = router;
