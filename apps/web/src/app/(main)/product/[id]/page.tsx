'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { gql, useMutation, useQuery } from 'urql';

import { Button } from '@/components/ui/button';
import { formatNaira } from '@/utils/currency';
import QuantityControl from '@/components/product/QuantityControl';
import StorePreview from '@/components/product/StorePreview';

const ProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const [quantity, setQuantity] = React.useState(1);

	const [{ data, fetching, error }] = useQuery({
		query: PRODUCT_QUERY,
		variables: { id }
	});

	const [{ fetching: addToCartFetching }, addToCart] =
		useMutation(ADD_TO_CART_MUTATION);

	const handleAddToCart = (storeId: string) => {
		addToCart({
			input: { storeId, productId: id, quantity }
		});
	};

	if (!id) return <div>Error: Product ID is missing</div>;
	if (fetching) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	const product = data?.product;

	if (!product) return <div>Product not found</div>;

	return (
		<div>
			<div className='container mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div className='md:col-span-2'>
						{product.images.length > 0 && (
							<img
								src={product.images[0].path}
								alt={product.name}
								className='w-full h-auto object-cover rounded-lg'
							/>
						)}
					</div>
					<div className='md:col-span-1'>
						<h1 className='text-xl font-medium mb-1'>{product.name}</h1>
						<p className='text-lg mb-2'>{formatNaira(product.unitPrice)}</p>
						<p className='text-gray-600 mb-4'>{product.description}</p>
						<QuantityControl value={quantity} onValueChange={setQuantity} />
						<Button
							disabled={addToCartFetching}
							onClick={() => handleAddToCart(data.product.store.id)}
							className='w-full'
						>
							Add to Cart
						</Button>
						<StorePreview
							store={data.product.store}
							followed={data.product.store.followedByUser}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export const runtime = 'edge';

export default ProductPage;

const PRODUCT_QUERY = gql`
	query ($id: ID!) {
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
				followedByUser
			}
		}
	}
`;

const ADD_TO_CART_MUTATION = gql`
	mutation AddToCart($input: AddToCartInput!) {
		addToCart(input: $input) {
			cartId
			productId
			quantity
		}
	}
`;
