'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useQuery } from 'urql';

import Header from '@/components/home/Header';
import { Button } from '@/components/ui/button';
import { formatNaira } from '@/utils/currency';

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
      store {
        id
        name
        description
        image {
          id
          path
        }
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
		<div>
			<div className='container mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<div>
						{product.images.length > 0 && (
							<img
								src={product.images[0].path}
								alt={product.name}
								className='w-full h-auto object-cover rounded-lg'
							/>
						)}
					</div>
					<div>
						<h1 className='text-3xl font-bold mb-4'>{product.name}</h1>
						<p className='text-xl font-semibold mb-2'>
							{formatNaira(product.unitPrice)}
						</p>
						<p className='text-gray-600 mb-4'>{product.description}</p>
						<Button>Add to Cart</Button>
					</div>
				</div>
				<div className='mt-8 border-t pt-6'>
					<h2 className='text-2xl font-semibold mb-4'>Sold by</h2>
					<div className='flex items-center'>
						{product.store.image && (
							<img
								src={product.store.image.path}
								alt={product.store.name}
								className='w-16 h-16 rounded-full mr-4 object-cover'
							/>
						)}
						<div>
							<div className='flex items-center'>
								{product.store.image && (
									<img
										src={product.store.image.path}
										alt={product.store.name}
										className='w-12 h-12 rounded-full mr-4 object-cover'
									/>
								)}
								<div>
									<h3 className='text-xl font-medium'>{product.store.name}</h3>
									<p className='text-gray-600'>{product.store.description}</p>
									<Link
										href={`/store/${product.store.id}`}
										className='text-blue-500 hover:underline mt-2 inline-block'
									>
										Visit Store
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const runtime = 'edge';

export default ProductPage;
