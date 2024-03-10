import { gql } from 'apollo-server-express';

// TODO: Investigate the pros/cons of doing this
// vs. just extending the existing stores/products queries.

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
