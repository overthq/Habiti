const UserType = `
	type User @entity {
		_id: ID! @id
		name: String! @column
		phone: String! @column
	}

	extend type Mutation {
		register(name: String!, phone: String!): String!
		authenticate(phone: String!): String!
		verifyAuthentication(phone: String!, code: String!): User!
	}

	extend type Query {
		users: [User!]!
	}
`;

export default UserType;
