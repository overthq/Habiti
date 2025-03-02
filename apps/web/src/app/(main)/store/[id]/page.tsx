'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { useQuery } from 'urql';

import Header from '@/components/home/Header';
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

	const [result] = useQuery({
		query: STORE_QUERY,
		variables: { id }
	});

	const { data, fetching, error } = result;

	if (!id) {
		return <div>Error: Store ID is missing</div>;
	}
	if (fetching) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<div className='container mx-auto py-8'>
				<h1 className='text-2xl font-bold'>{data.store.name}</h1>
				<p className='text-gray-600'>{data.store.description}</p>
				<div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
					{data.store.products.map((product: any) => (
						<Product key={product.id} {...product} />
					))}
				</div>
			</div>
		</div>
	);
};

export const runtime = 'edge';

export default StorePage;
