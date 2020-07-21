import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
mongoose.connect(process.env.MONGODB_URL!, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});
