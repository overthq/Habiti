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
`;

export default UserTypes;
