'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { useQuery } from 'urql';

import Product from '@/components/store/Product';

const STORE_QUERY = `
	query($id: ID!) {
		store(id: $id) {
			id
			name
			description
			products {
				id
				name
				unitPrice
				images {
					id
					path
				}
			}
		}
	}
`;

const StorePage = () => {
	const { id } = useParams();

	const [result, reexecuteQuery] = useQuery({
		query: STORE_QUERY,
		variables: { id }
	});

	const { data, fetching, error } = result;

	React.useEffect(() => {
		// You can reexecute the query when needed
		// reexecuteQuery({ requestPolicy: 'network-only' });
	}, []);

	if (!id) {
		return <div>Error: Store ID is missing</div>;
	}
	if (fetching) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<div>
				<h1>{data.store.name}</h1>
				<p>{data.store.description}</p>
				<div>
					{data.store.products.map((product: any) => (
						<Product key={product.id} {...product} />
					))}
				</div>
			</div>
		</div>
	);
};

export default StorePage;
