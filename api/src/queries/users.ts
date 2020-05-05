import { User } from '../models';

export const users = async () => {
	const allUsers = await User.find();
	return allUsers;
};
