import gql from 'graphql-tag';

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
