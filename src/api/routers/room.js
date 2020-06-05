const express = require('express');
const router = new express.Router();

const { Room } = require('../../models/room');
const { createRoomService } = require('../../services/rooms.service');

const roomService = createRoomService(Room);

router.get('/rooms', async (req, res) => {
	const { error, rooms } = await roomService.getRooms();
	if (error) {
		return res.status(400).send(error);
	}
	res.send(rooms);
});

router.post('/rooms', async (req, res) => {
	const { error, room } = await roomService.addRoom(req.body);
	if (error) {
		return res.status(400).send(error);
	}
	res.send(room);
});

module.exports = router;
