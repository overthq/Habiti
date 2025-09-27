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
				<div className='bg-gray-200 rounded-lg overflow-hidden'>
					{images.length > 0 ? (
						<img
							src={images[0].path}
							alt={name}
							className='w-full h-48 object-cover rounded-lg'
						/>
					) : (
						<div className='w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400' />
					)}
				</div>
				<div className='mt-2'>
					<p className='font-medium'>{name}</p>
					<p className='text-gray-600'>{formatNaira(unitPrice)}</p>
				</div>
			</div>
		</Link>
	);
};

export const runtime = 'edge';

export default Product;
