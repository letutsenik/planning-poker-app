import { FilterQuery, UpdateQuery } from 'mongoose';
import { User, UserModel } from '../models/user';
import { Identifier } from '../types';

export const createUserService = (Users: UserModel) => {
	const addUser = async ({ name = 'unknown', roomId, socketId }: User) => {
		const user = new Users({ name: name.trim(), roomId, socketId });

		try {
			await user.save();
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUsers = async (conditions: FilterQuery<User>) => {
		try {
			const users = await Users.find(conditions);
			return { users };
		} catch (error) {
			return { error };
		}
	};
	const removeUser = async (conditions: FilterQuery<User>) => {
		try {
			const user = await Users.findOneAndDelete(conditions);
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUserById = async (userId: Identifier) => {
		try {
			const user = await Users.findById(userId);
			return { user };
		} catch (error) {
			return { error };
		}
	};

	const getUser = async (conditions: FilterQuery<User>) => {
		try {
			const user = await Users.findOne(conditions);
			return { user };
		} catch (error) {
			return { error };
		}
	};

	const updateUser = async (
		conditions: FilterQuery<User>,
		update: UpdateQuery<User>,
	) => {
		try {
			const user = await Users.findOneAndUpdate(conditions, update, {
				new: true,
			});
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUsersInRoom = async (roomId: Identifier) => {
		try {
			const users = await Users.find({ roomId });
			return { users };
		} catch (error) {
			return { error };
		}
	};

	const getVoteByRoom = async (roomId: Identifier) => {
		try {
			const users = await Users.find({ roomId });
			const voteData = users.reduce(
				(data: Array<{ user?: string; vote: number | null }>, user: User) => {
					return user.vote
						? [
								...data,
								{
									user: user.name,
									vote: user.vote,
								},
						  ]
						: [...data];
				},
				[],
			);

			return { voteData };
		} catch (error) {
			return { error };
		}
	};

	const clearVotesByRoom = async (roomId: Identifier) => {
		try {
			const res = await Users.updateMany({ roomId }, { vote: null });
			return { res };
		} catch (error) {
			return { error };
		}
	};

	return {
		addUser,
		getUsers,
		removeUser,
		getUserById,
		getUser,
		updateUser,
		getUsersInRoom,
		getVoteByRoom,
		clearVotesByRoom,
	};
};
