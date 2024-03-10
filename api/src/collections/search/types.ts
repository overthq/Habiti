import { gql } from 'apollo-server-express';

const SearchTypes = gql`
	type SearchResults {
		products: [Product!]!
		stores: [Store!]!
	}

	extend type Query {
		search(searchTerm: String!): SearchResults
	}
`;

export default SearchTypes;
