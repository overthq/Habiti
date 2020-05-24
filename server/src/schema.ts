import { makeSqlmancerSchema } from 'sqlmancer';
import gql from 'graphql-tag';
import { client } from './database';

const typeDefs = gql`
	type Query @sqlmancer(dialect: POSTGRES) {
		users: [User!]! @many
		user(id: ID!): User!
		orders: [Order!]! @where @many
	}

	type Mutation {
		createUser: User @input(action: CREATE)
		createStore: Store @input(action: CREATE)
		createManager: Manager @input(action: CREATE)
		createItem: Item @input(action: CREATE)
	}

	type User @model(table: "users", pk: "id") {
		id: ID!
		name: String!
		phone: String!
		created_at: String! @hasDefault
		updated_at: String! @hasDefault
	}

	type Store @model(table: "stores", pk: "id") {
		id: ID!
		name: String!
		short_name: String!
		created_at: String!
		updated_at: String!
	}

	type Manager @model(table: "managers", pk: "id") {
		id: ID!
		store_id: ID!
		name: String!
		email: String!
		created_at: String!
		updated_at: String!
		store: Store! @relate(on: [{ from: "store_id", to: "id" }])
	}

	enum OrderStatus {
		Pending
		Processing
		Fulfilled
	}

	type Order @model(table: "orders", pk: "id") {
		id: ID!
		user_id: ID!
		store_id: ID!
		status: OrderStatus!
		created_at: String!
		updated_at: String!
		store: Store! @relate(on: [{ from: "store_id", to: "id" }])
		user: User! @relate(on: [{ from: "user_id", to: "id" }])
	}

	enum ItemUnit {
		Kilogram
		Litre
		Cup
	}

	type Item @model(table: "items", pk: "id") {
		id: ID!
		store_id: ID!
		name: String!
		description: String!
		unit: ItemUnit!
		price_per_unit: Int!
		featured: Boolean!
		created_at: String!
		updated_at: String!
		store: Store! @relate(on: [{ from: "store_id", to: "id" }])
	}

	type StoreProfile @model(table: "store_profiles", pk: "id") {
		id: ID!
		store_id: ID!
		website_url: String
		instagram_username: String
		twitter_username: String
		created_at: String!
		updated_at: String!
		store: Store! @relate(on: [{ from: "store_id", to: "id" }])
	}

	type OrderItem @model(table: "order_items", pk: "id") {
		id: ID!
		order_id: ID!
		item_id: ID!
		quantity: Int!
		order: Order! @relate(on: [{ from: "order_id", to: "id" }])
		item: Item! @relate(on: [{ from: "item_id", to: "id" }])
	}

	type StoreFollower @model(table: "store_followers", pk: "id") {
		id: ID!
		store_id: ID!
		user_id: ID!
		store: Store! @relate(on: [{ from: "store_id", to: "id" }])
		user: User! @relate(on: [{ from: "user_id", to: "id" }])
	}
`;

export const schema = makeSqlmancerSchema({
	typeDefs,
	resolvers: {
		Query: {
			users: (_, __, ___, info) => {
				return client.models.User.findMany().resolveInfo(info).execute();
			},
			user: (_, { id }, ___, info) => {
				return client.models.User.findById(id).resolveInfo(info).execute();
			}
		}
	}
});

export default schema;
