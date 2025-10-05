'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { formatNaira } from '@/utils/currency';
import QuantityControl from '@/components/product/QuantityControl';
import StorePreview from '@/components/product/StorePreview';
import { useProductQuery } from '@/data/queries';
import { useAddToCartMutation } from '@/data/mutations';
import { Image } from '@/data/types';

const ProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const [activeImage, setActiveImage] = React.useState(0);
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

	if (!data?.product) return <div>Product not found</div>;

	const product = data.product;

	return (
		<div className='container mx-auto px-4'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				<div className='md:col-span-2'>
					{product.images.length > 0 ? (
						<img
							key={product.id}
							src={product.images[activeImage].path}
							alt={product.name}
							className='w-full max-w-170 h-auto object-cover rounded-lg'
						/>
					) : (
						<div className='w-full max-w-170 h-96 bg-gray-200 rounded-lg' />
					)}
					<ImageSelector
						images={product.images}
						onSelectImage={setActiveImage}
					/>
				</div>
				<div className='md:col-span-1'>
					<StorePreview store={data.product.store} />
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
				</div>
			</div>
		</div>
	);
};

interface ImageSelectorProps {
	images: Image[];
	onSelectImage(index: number): void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
	images,
	onSelectImage
}) => {
	return (
		<div className='flex mt-4 gap-4'>
			{images.map((image, index) => (
				<div
					key={image.id}
					className='size-14 rounded-sm overflow-hidden'
					onClick={() => onSelectImage(index)}
				>
					<img src={image.path} className='size-full' />
				</div>
			))}
		</div>
	);
};

export const runtime = 'edge';

export default ProductPage;
