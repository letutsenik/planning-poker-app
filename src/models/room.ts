import mongoose from 'mongoose';
import { Document, Model } from 'mongoose';

const Schema = mongoose.Schema;

const roomSchema = new Schema({
	name: { type: String, default: 'default' },
});

export interface Room extends Document {
	name?: string;
}
export interface RoomModel extends Model<Room> {}

export const Room = mongoose.model<Room, RoomModel>('Room', roomSchema);
