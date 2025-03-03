'use client';

import { gql, useQuery } from 'urql';

const CART_QUERY = gql`
	query Cart($id: ID!) {
		cart(id: $id) {
			id
		}
	}
`;

const CartPage = () => {
	const [{ data, fetching, error }] = useQuery({ query: CART_QUERY });

	return <div>Cart</div>;
};

export default CartPage;
