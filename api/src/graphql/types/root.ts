import gql from 'graphql-tag';

const RootTypes = gql`
	scalar Upload

	interface Node {
		id: ID!
	}

	type PageInfo {
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: String
		endCursor: String
	}

	enum Sort {
		asc
		desc
	}

	input IntWhere {
		lt: Int
		lte: Int
		gt: Int
		gte: Int
	}

	enum StringWhereMode {
		default
		insensitive
	}

	input StringWhere {
		contains: String
		search: String
		startsWith: String
		endsWith: String
		mode: StringWhereMode
		equals: String
	}

	type Query {
		node(id: ID!): Node
	}

	type Mutation {
		_: Boolean
	}
`;

export default RootTypes;
