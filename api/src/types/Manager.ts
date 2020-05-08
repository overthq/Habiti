const ManagerType = `
	type Manager @entity {
		_id: ID! @id
		name: String! @column
		email: String! @column
		role: ManagerRole! @column
	}

	enum ManagerRole {
		Admin
	}

	input ManagerInput {
		name: String
		email: String
		role: ManagerRole
	}

	extend type Query {
		storeManagers(storeId: ID!): [Manager!]!
	}

	extend type Mutation {
		createManager(storeId: ID!, input: ManagerInput): Manager!
		updateManager(managerId: ID!, input: ManagerInput): Manager!
		authenticateManager(storeId: ID!, email: String!): String!
		verifyManagerAuthentication(email: String!, code: String!): Manager!
	}
`;

export default ManagerType;
