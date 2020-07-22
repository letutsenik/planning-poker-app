import mongoose from 'mongoose';
import chalk from 'chalk';

mongoose
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	.connect(process.env.MONGODB_URL!, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(data =>
		console.log(
			`Connection ${chalk.green.bold(
				'successfully',
			)} established to database '${chalk.yellow.bold(
				data.connections[0].name,
			)}' on port ${chalk.blue.bold(data.connections[0].port)}`,
		),
	)
	.catch(error => {
		console.log(chalk.red.bold('Mongoose connection error:'));
		console.log(error);
	});
