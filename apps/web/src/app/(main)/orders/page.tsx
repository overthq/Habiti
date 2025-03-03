'use client';

import { gql, useQuery } from 'urql';

const ORDERS_QUERY = gql`
	query Orders {
		currentUser {
			id
			orders {
				id
				store {
					id
					name
					image {
						id
						path
					}
				}
				products {
					orderId
					productId
					product {
						id
						name
					}
					unitPrice
					quantity
				}
				total
				status
				createdAt
			}
		}
	}
`;

const OrdersPage = () => {
	const [{ data, fetching, error }] = useQuery({ query: ORDERS_QUERY });

	return (
		<div>
			<h1>Orders</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export default OrdersPage;
