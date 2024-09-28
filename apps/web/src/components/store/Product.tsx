'use client';

import Image from 'next/image';
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
					{images.length > 0 && (
						<Image
							src={images[0].path}
							alt={name}
							className='w-full h-48 object-cover rounded-lg'
						/>
					)}
				</div>
				<div className='mt-4'>
					<h2 className='text-lg font-semibold mb-1'>{name}</h2>
					<p className='text-gray-600'>{formatNaira(unitPrice)}</p>
				</div>
			</div>
		</Link>
	);
};

export const runtime = 'edge';

export default Product;
