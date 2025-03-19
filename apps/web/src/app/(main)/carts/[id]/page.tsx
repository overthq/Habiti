'use client';

import { useParams } from 'next/navigation';
import { gql, useQuery } from 'urql';

const CART_QUERY = gql`
	query Cart($id: ID!) {
		cart(id: $id) {
			id
			userId
			user {
				id
				cards {
					id
					email
					cardType
					last4
				}
			}
			storeId
			store {
				id
				name
			}
			products {
				cartId
				productId
				product {
					id
					name
					unitPrice
					storeId
					images {
						id
						path
					}
				}
				quantity
			}
			total
		}
	}
`;

const CartPage = () => {
	const { id } = useParams();
	const [{ data, fetching, error }] = useQuery({
		query: CART_QUERY,
		variables: { id }
	});

	return <div>Cart</div>;
};

export default CartPage;
