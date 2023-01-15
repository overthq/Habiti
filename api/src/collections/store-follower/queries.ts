import { Resolver } from '../../types/resolvers';

const id: Resolver = async parent => {
	return `${parent.storeId}-${parent.followerId}`;
};

const store: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.storeFollower
		.findUnique({
			where: {
				storeId_followerId: {
					storeId: parent.storeId,
					followerId: parent.followerId
				}
			}
		})
		.store();
};

const follower: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.storeFollower
		.findUnique({
			where: {
				storeId_followerId: {
					storeId: parent.storeId,
					followerId: parent.followerId
				}
			}
		})
		.follower();
};

export default {
	StoreFollower: {
		id,
		store,
		follower
	}
};
