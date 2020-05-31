import { makeSqlmancerSchema } from 'sqlmancer';
import gql from 'graphql-tag';
import { IResolvers } from 'sqlmancer/node_modules/graphql-tools';
import { sign } from 'jsonwebtoken';
import util from 'util';
import { client } from './database';
import redisClient from './redisClient';

const sendVerificationCode = async (key: string) => {
	const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
	redisClient.set(key, randomCode);
	redisClient.expire(key, 600);
	console.log(key, randomCode);
};

const get = util.promisify(redisClient.get).bind(redisClient);

const typeDefs = gql`
	directive @isAuthenticated on FIELD_DEFINITION
	directive @hasRole(role: String!) on FIELD_DEFINITION

	type Query @sqlmancer(dialect: POSTGRES) {
		users: [User!]! @many
		user(id: ID!): User!
		currentUser: User! @isAuthenticated @hasRole(role: "user")

		orders: [Order!]! @many
		userOrders: [Order!]! @many @isAuthenticated @hasRole(role: "user")
		storeOrders: [Order!]! @many @isAuthenticated @hasRole(role: "manager")
		order(id: ID!): Order!

		items: [Item!]! @many
		item(id: ID!): Item!

		stores: [Store!]! @many
		store(id: ID!): Store!

		managers: [Manager!]! @many
		manager(id: ID!): Manager!
		currentManager: Manager! @isAuthenticated @hasRole(role: "manager")

		storeProfile: StoreProfile! @where

		storeFollowers: [StoreFollower!]! @many @isAuthenticated
		storesFollowed: [StoreFollower!]! @isAuthenticated @hasRole(role: "user")
	}

	type Mutation {
		authenticate(phone: String!): String!
		register(name: String!, phone: String!): String!
		verifyAuthentication(phone: String!, code: String!): String!
		createUser: User! @input(action: CREATE)
		updateUser(id: ID!): User! @input(action: UPDATE)

		createStore: Store! @input(action: CREATE)
		updateStore(id: ID!): Store!
			@input(action: UPDATE)
			@isAuthenticated
			@hasRole(role: "manager")

		createStoreProfile: StoreProfile! @input(action: CREATE)
		updateStoreProfile: StoreProfile!
			@where
			@input(action: UPDATE)
			@isAuthenticated
			@hasRole(role: "manager")

		authenticateManager(store_id: ID!, email: String!): String!
		verifyManagerAuthentication(email: String!, code: String!): String!
		createManager: Manager! @input(action: CREATE)
		updateManager(id: ID!): Manager!
			@input(action: UPDATE)
			@isAuthenticated
			@hasRole(role: "manager")

		createItem: Item!
			@input(action: CREATE)
			@isAuthenticated
			@hasRole(role: "manager")
		updateItem(id: ID!): Item!
			@input(action: UPDATE)
			@isAuthenticated
			@hasRole(role: "manager")

		createOrders: [Order!]! @input(action: CREATE, list: true)
		createOrder: Order!
			@input(action: CREATE)
			@isAuthenticated
			@hasRole(role: "user")
		updateOrder(id: ID!): Order!
			@input(action: UPDATE)
			@isAuthenticated
			@hasRole(role: "user")

		createOrderItems: [OrderItem!]!
			@input(action: CREATE, list: true)
			@isAuthenticated
			@hasRole(role: "user")
		createOrderItem: OrderItem!
			@input(action: CREATE)
			@isAuthenticated
			@hasRole(role: "user")
		updateOrderItem(id: ID!): OrderItem!
			@input(action: UPDATE)
			@isAuthenticated
			@hasRole(role: "user")

		createStoreFollower: StoreFollower
		followStore(storeId: ID!): StoreFollower!
			@isAuthenticated
			@hasRole(role: "user")
		unfollowStore(storeId: ID!): Boolean!
			@isAuthenticated
			@hasRole(role: "user")
	}

	type User @model(table: "users", pk: "id") {
		id: ID! @hasDefault
		name: String!
		phone: String!
		created_at: String! @hasDefault
		updated_at: String! @hasDefault
	}

	type Store @model(table: "stores", pk: "id") {
		id: ID! @hasDefault
		name: String!
		short_name: String!
		created_at: String! @hasDefault
		updated_at: String! @hasDefault
		profile: StoreProfile! @relate(on: { from: "id", to: "store_id" })
	}

	type Manager @model(table: "managers", pk: "id") {
		id: ID! @hasDefault
		store_id: ID!
		name: String!
		email: String!
		created_at: String! @hasDefault
		updated_at: String! @hasDefault
		store: Store! @relate(on: { from: "store_id", to: "id" })
	}

	enum OrderStatus {
		Pending
		Processing
		Fulfilled
	}

	type Order @model(table: "orders", pk: "id") {
		id: ID! @hasDefault
		user_id: ID!
		store_id: ID!
		status: OrderStatus! @hasDefault
		created_at: String! @hasDefault
		updated_at: String! @hasDefault
		store: Store! @relate(on: { from: "store_id", to: "id" })
		user: User! @relate(on: { from: "user_id", to: "id" })
		cart: [OrderItem!]! @relate(on: { from: "id", to: "order_id" }) @many
	}

	enum ItemUnit {
		Kilogram
		Litre
		Cup
	}

	type Item @model(table: "items", pk: "id") {
		id: ID! @hasDefault
		store_id: ID!
		name: String!
		description: String!
		unit: ItemUnit!
		price_per_unit: Int!
		featured: Boolean!
		created_at: String! @hasDefault
		updated_at: String! @hasDefault
		store: Store! @relate(on: { from: "store_id", to: "id" })
	}

	type StoreProfile @model(table: "store_profiles", pk: "id") {
		id: ID! @hasDefault
		store_id: ID!
		bio: String
		website_url: String
		instagram_username: String
		twitter_username: String
		created_at: String! @hasDefault
		updated_at: String! @hasDefault
		store: Store! @relate(on: { from: "store_id", to: "id" })
		followers: [StoreFollower!]!
			@relate(on: { from: "store_id", to: "store_id" })
	}

	type OrderItem @model(table: "order_items", pk: "id") {
		id: ID! @hasDefault
		order_id: ID!
		item_id: ID!
		quantity: Int!
		order: Order! @relate(on: { from: "order_id", to: "id" })
		item: Item! @relate(on: { from: "item_id", to: "id" })
	}

	type StoreFollower @model(table: "store_followers", pk: "id") {
		id: ID! @hasDefault
		store_id: ID!
		user_id: ID!
		store: Store! @relate(on: { from: "store_id", to: "id" })
		user: User! @relate(on: { from: "user_id", to: "id" })
	}
`;

const {
	User,
	Store,
	Order,
	Item,
	Manager,
	StoreFollower,
	OrderItem
} = client.models;

const resolvers: IResolvers = {
	Query: {
		users: (_, __, ___, info) => {
			return User.findMany().resolveInfo(info).execute();
		},
		user: (_, { id }, ___, info) => {
			return User.findById(id).resolveInfo(info).execute();
		},
		currentUser: (_, __, { user }, info) => {
			return User.findById(user.id).resolveInfo(info).execute();
		},
		stores: (_, __, ___, info) => {
			return Store.findMany().resolveInfo(info).execute();
		},
		store: (_, { id }, ___, info) => {
			return Store.findById(id).resolveInfo(info).execute();
		},
		userOrders: async (_, __, { user }, info) => {
			return Order.findMany()
				.where({ user_id: { equal: user.id } })
				.resolveInfo(info)
				.execute();
		},
		storeOrders: async (_, __, { user }, info) => {
			return Order.findMany()
				.where({ store_id: { equal: user.store_id } })
				.resolveInfo(info)
				.execute();
		},
		order: (_, { id }, ___, info) => {
			return Order.findById(id).resolveInfo(info).execute();
		},
		items: (_, __, ___, info) => {
			return Item.findMany().resolveInfo(info).execute();
		},
		item: (_, { id }, ___, info) => {
			return Item.findById(id).resolveInfo(info).execute();
		},
		managers: (_, __, ___, info) => {
			return Manager.findMany().resolveInfo(info).execute();
		},
		manager: (_, { id }, ___, info) => {
			return Manager.findById(id).resolveInfo(info).execute();
		},
		currentManager: (_, __, { user }, info) => {
			return Manager.findById(user.id).resolveInfo(info).execute();
		},
		storeFollowers: (_, { where }, __, info) => {
			return StoreFollower.findMany().where(where).resolveInfo(info).execute();
		},
		storesFollowed: (_, __, { user }, info) => {
			return StoreFollower.findMany()
				.where({ user_id: { equal: user.id } })
				.resolveInfo(info)
				.execute();
		}
	},
	Mutation: {
		createUser: async (_, { input }, __, info) => {
			const id = await User.createOne(input).execute();
			return User.findById(id).resolveInfo(info).execute();
		},
		authenticate: async (_, { phone }, __, info) => {
			await User.findOne()
				.where({ phone: { equal: phone } })
				.resolveInfo(info)
				.execute();
			sendVerificationCode(phone);

			return `Verification code sent to ${phone}`;
		},
		verifyAuthentication: async (_, { phone, code }) => {
			const verificationCode = await get(phone);
			if (!verificationCode) {
				throw new Error(
					`Verification code for ${phone} not found. Looks like it might have expired.`
				);
			}

			if (verificationCode !== code) {
				throw new Error('Invalid verification code entered');
			}

			const user = await User.findOne()
				.where({ phone: { equal: phone } })
				.execute();
			const accessToken = sign(
				{ ...user, role: 'user' },
				process.env.JWT_SECRET
			);

			return accessToken;
		},
		register: async (_, { name, phone }) => {
			await User.createOne({ name, phone }).execute();
			sendVerificationCode(phone);

			return `Verification code sent to ${phone}`;
		},
		authenticateManager: async (_, { store_id, email }) => {
			await Manager.findOne()
				.where({ store_id: { equal: store_id }, email: { equal: email } })
				.execute();
			sendVerificationCode(email);

			return `Verification email sent to ${email}`;
		},
		verifyManagerAuthentication: async (_, { email, code }) => {
			const verificationCode = await get(email);
			if (!verificationCode) {
				throw new Error(
					`Verification code for ${email} not found. Looks like it might have expired.`
				);
			}

			if (verificationCode !== code) {
				throw new Error('Invalid verification code entered');
			}

			const manager = await Manager.findOne().where({ email }).execute();
			const accessToken = sign(
				{ ...manager, role: 'manager' },
				process.env.JWT_SECRET
			);

			return accessToken;
		},
		createStore: async (_, { input }, __, info) => {
			const id = await Store.createOne(input).execute();
			return Store.findById(id).resolveInfo(info).execute();
		},
		followStore: async (_, { storeId }, { user }, info) => {
			const id = await StoreFollower.createOne({
				// eslint-disable-next-line
				store_id: storeId,
				// eslint-disable-next-line
				user_id: user.id
			}).execute();

			return StoreFollower.findById(id).resolveInfo(info).execute();
		},
		unfollowStore: async (_, { storeId }, { user }) => {
			const deleted = await StoreFollower.deleteMany()
				.where({ store_id: { equal: storeId }, user_id: { equal: user.id } })
				.execute();
			return deleted > 0;
		},
		createOrderItems: async (_, { input }, info) => {
			const ids = await OrderItem.createMany(input).execute();
			return OrderItem.findMany()
				.resolveInfo(info)
				.where({ id: { in: ids } })
				.execute();
		}
	}
};

const schema = makeSqlmancerSchema({
	typeDefs,
	resolvers,
	directiveResolvers: {
		isAuthenticated: (next, _, __, context) => {
			if (!context || !context.user) {
				throw new Error('You are not authenticated');
			}
			return next();
		},
		hasRole: (next, _, { role }, context) => {
			if (context.user.role !== role) {
				throw new Error(
					'Requested action can not be carried out on the specified role'
				);
			}
			return next();
		}
	}
});

export default schema;
