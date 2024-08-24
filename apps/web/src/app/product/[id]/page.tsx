'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { useQuery } from 'urql';

const PRODUCT_QUERY = `
  query($id: ID!) {
    product(id: $id) {
      id
      name
      description
      unitPrice
      images {
        id
        path
      }
    }
  }
`;

const ProductPage = () => {
	const { id } = useParams();

	const [result] = useQuery({
		query: PRODUCT_QUERY,
		variables: { id }
	});

	const { data, fetching, error } = result;

	if (!id) {
		return <div>Error: Product ID is missing</div>;
	}
	if (fetching) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	const product = data?.product;

	if (!product) {
		return <div>Product not found</div>;
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-4'>{product.name}</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<div>
					{product.images && product.images.length > 0 && (
						<img
							src={product.images[0].path}
							alt={product.name}
							className='w-full h-auto object-cover rounded-lg'
						/>
					)}
				</div>
				<div>
					<p className='text-xl font-semibold mb-2'>
						${product.unitPrice.toFixed(2)}
					</p>
					<p className='text-gray-600 mb-4'>{product.description}</p>
					<button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
