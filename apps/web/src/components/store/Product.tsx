'use client';

import Link from 'next/link';
import React from 'react';

import { formatNaira } from '@/utils/currency';

interface ProductProps {
	id: string;
	name: string;
	unitPrice: number;
	images: { id: string; path: string }[];
}

const Product: React.FC<ProductProps> = ({ id, name, unitPrice, images }) => {
	return (
		<div key={id} className='relative'>
			<Link
				href={`/product/${id}`}
				className='absolute top-0 bottom-0 right-0 left-0'
			/>
			<div className='bg-secondary rounded-lg overflow-hidden'>
				{images.length > 0 ? (
					<img
						src={images[0].path}
						alt={name}
						className='w-full h-48 object-cover rounded-lg'
					/>
				) : (
					<div className='w-full h-48 bg-secondary flex items-center justify-center rounded-lg text-muted-foreground' />
				)}
			</div>
			<div className='mt-2'>
				<p className='font-medium'>{name}</p>
				<p className='text-muted-foreground'>{formatNaira(unitPrice)}</p>
			</div>
		</div>
	);
};

export const runtime = 'edge';

export default Product;
