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
		<Link href={`/product/${id}`}>
			<div key={id}>
				<div className='bg-muted aspect-square rounded-lg overflow-hidden'>
					{images.length > 0 && (
						<img
							src={images[0].path}
							alt={name}
							className='size-full object-cover'
						/>
					)}
				</div>
				<div className='mt-2'>
					<p className='font-medium'>{name}</p>
					<p className='text-muted-foreground'>{formatNaira(unitPrice)}</p>
				</div>
			</div>
		</Link>
	);
};

export const runtime = 'edge';

export default Product;
