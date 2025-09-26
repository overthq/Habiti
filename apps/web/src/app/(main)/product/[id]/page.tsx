'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { formatNaira } from '@/utils/currency';
import QuantityControl from '@/components/product/QuantityControl';
import StorePreview from '@/components/product/StorePreview';
import { useProductQuery } from '@/data/queries';
import { useAddToCartMutation } from '@/data/mutations';

const ProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const [quantity, setQuantity] = React.useState(1);

	const { data, isLoading } = useProductQuery(id);
	const addToCartMutation = useAddToCartMutation();

	const handleAddToCart = (storeId: string) => {
		addToCartMutation.mutate({
			storeId,
			productId: id,
			quantity
		});
	};

	if (isLoading) return <div />;

	const product = data?.product;

	if (!product) return <div>Product not found</div>;

	return (
		<div className='container mx-auto px-4'>
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
						disabled={addToCartMutation.isPending}
						onClick={() => handleAddToCart(data.product.store.id)}
						className='w-full'
					>
						Add to Cart
					</Button>
					<StorePreview store={data.product.store} />
				</div>
			</div>
		</div>
	);
};

export const runtime = 'edge';

export default ProductPage;
