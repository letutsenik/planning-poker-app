const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, default: 'unknown' },
	roomId: { type: Number, default: 0 },
	vote: { type: Number, default: null },
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
