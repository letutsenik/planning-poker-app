const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, default: 'unknown' },
	roomId: Number,
	vote: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
