import { FilterQuery, UpdateQuery } from 'mongoose';
import { User, UserFields, UserModel } from '../models/user';
import { Identifier, ServiceError } from '../types';

type createUserServiceType = {
	addUser: ({
		name,
		roomId,
		socketId,
	}: UserFields) => Promise<ServiceError & { user?: User }>;
	getUsers: (
		conditions?: FilterQuery<User>,
	) => Promise<ServiceError & { users?: Array<User> }>;
	removeUser: (
		conditions: FilterQuery<User>,
	) => Promise<ServiceError & { user?: User | null }>;
	getUserById: (
		userId: Identifier,
	) => Promise<ServiceError & { user?: User | null }>;
	getUser: (
		conditions: FilterQuery<User>,
	) => Promise<ServiceError & { user?: User | null }>;
	updateUser: (
		conditions: FilterQuery<User>,
		update: UpdateQuery<User>,
	) => Promise<ServiceError & { user?: User | null }>;
	getUsersInRoom: (
		roomId: Identifier,
	) => Promise<ServiceError & { users?: Array<User> }>;
	getVoteByRoom: (
		roomId: Identifier,
	) => Promise<
		ServiceError & { voteData?: Array<{ user?: string; vote: number | null }> }
	>;
	clearVotesByRoom: (
		roomId: Identifier,
	) => Promise<ServiceError & { res?: { n: number; nModified: number } }>;
};

export const createUserService = (Users: UserModel): createUserServiceType => {
	const addUser = async ({
		name = 'unknown',
		roomId,
		socketId,
	}: UserFields): Promise<ServiceError & { user?: User }> => {
		const user = new Users({ name: name.trim(), roomId, socketId });

		try {
			await user.save();
			return { user };
		} catch (error) {
			return { error };
		}
	};

	const getUsers = async (
		conditions?: FilterQuery<User>,
	): Promise<ServiceError & { users?: Array<User> }> => {
		try {
			const users = await Users.find(conditions || {});
			return { users };
		} catch (error) {
			return { error };
		}
	};
	const removeUser = async (
		conditions: FilterQuery<User>,
	): Promise<ServiceError & { user?: User | null }> => {
		try {
			const user = await Users.findOneAndDelete(conditions);
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUserById = async (
		userId: Identifier,
	): Promise<ServiceError & { user?: User | null }> => {
		try {
			const user = await Users.findById(userId);
			return { user };
		} catch (error) {
			return { error };
		}
	};

	const getUser = async (
		conditions: FilterQuery<User>,
	): Promise<ServiceError & { user?: User | null }> => {
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
	): Promise<ServiceError & { user?: User | null }> => {
		try {
			const user = await Users.findOneAndUpdate(conditions, update, {
				new: true,
			});
			return { user };
		} catch (error) {
			return { error };
		}
	};
	const getUsersInRoom = async (
		roomId: Identifier,
	): Promise<ServiceError & { users?: Array<User> }> => {
		try {
			const users = await Users.find({ roomId });
			return { users };
		} catch (error) {
			return { error };
		}
	};

	const getVoteByRoom = async (
		roomId: Identifier,
	): Promise<
		ServiceError & { voteData?: Array<{ user?: string; vote: number | null }> }
	> => {
		try {
			const users = await Users.find({ roomId });
			const voteData = users.reduce(
				(
					data: Array<{ user?: string; vote: number | null }>,
					user: UserFields,
				) => {
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

	const clearVotesByRoom = async (
		roomId: Identifier,
	): Promise<ServiceError & { res?: { n: number; nModified: number } }> => {
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
