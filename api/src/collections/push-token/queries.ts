import { Resolver } from '../../types/resolvers';

const id: Resolver = parent => {
	return `${parent.userId}-${parent.token}`;
};

export default {
	UserPushToken: {
		id
	}
};
