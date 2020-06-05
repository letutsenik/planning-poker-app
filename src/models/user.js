const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, default: 'unknown' },
	roomId: { type: String, default: '5ed9f5f976f1561d04f1caa9' },
	vote: { type: Number, default: null },
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
