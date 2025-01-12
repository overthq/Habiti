import gql from 'graphql-tag';

const DeliveryAddressTypes = gql`
	type DeliveryAddress {
		id: ID!
		userId: ID!
		name: String

		user: User!
	}

	input AddDeliveryAddressInput {
		name: String
	}

	extend type Mutation {
		addDeliveryAddress(input: AddDeliveryAddressInput): DeliveryAddress
	}
`;

export default DeliveryAddressTypes;
