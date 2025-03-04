'use client';

import { gql, useQuery } from 'urql';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const ORDER_QUERY = gql`
	query Order($id: ID!) {
		order(id: $id) {
			id
			storeId
			products {
				orderId
				productId
				product {
					id
					name
					unitPrice
					quantity
					images {
						id
						path
					}
				}
			}
		}
	}
`;

const OrderPage = () => {
	const { id } = useParams<{ id: string }>();
	const [{ data, fetching, error }] = useQuery({
		query: ORDER_QUERY,
		variables: { id }
	});

	if (fetching) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<Link href={`/store/${data?.order.storeId}`}>View store</Link>
		</div>
	);
};

export default OrderPage;
