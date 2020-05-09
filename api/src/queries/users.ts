import { User } from '../models';

export const users = async () => {
	const allUsers = await User.find();
	return allUsers;
};

export const currentUser = async (_, __, { user }) => {
	if (!user) throw new Error('You are not authenticated');

	const authenticatedUser = await User.findById(user.id);
	if (!authenticatedUser) throw new Error('Specified user does not exist');

	return authenticatedUser;
};
