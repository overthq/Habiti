const UserType = `
	type User @entity {
		_id: ID! @id
		name: String! @column
		phone: String! @column
	}

	extend type Mutation {
		register(name: String!, phone: String!): String!
		authenticate(phone: String!): String!
		verifyAuthentication(phone: String!, code: String!): String!
	}

	extend type Query {
		currentUser: User!
		users: [User!]!
	}
`;

export default UserType;
