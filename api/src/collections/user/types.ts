const UserTypes = `
	type User {
		id: ID!
		name: String!
		phone: String!
	}

	extend type Query {
		user(id: ID!): User!
		users: [User!]!
	}

	extend type Mutation {
		deleteUser(userId: ID!): ID!
	}
`;

export default UserTypes;
