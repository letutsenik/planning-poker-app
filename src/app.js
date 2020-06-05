const express = require('express');
require('./db/mongoose');
const path = require('path');
const userRouter = require('./api/routers/user');
const roomRouter = require('./api/routers/room');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(userRouter);
app.use(roomRouter);

module.exports = app;
