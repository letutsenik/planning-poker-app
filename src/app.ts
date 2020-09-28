import express from 'express';
import './db/mongoose';
import path from 'path';
import userRouter from './api/routers/user';
import roomRouter from './api/routers/room';

const app = express();

const publicDirectoryPath = path.join(__dirname, '../../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(userRouter);
app.use(roomRouter);

export default app;
