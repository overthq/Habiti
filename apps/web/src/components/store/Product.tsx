'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

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
				className='absolute top-0 bottom-0 right-0 left-0 z-2'
			/>
			<div className='bg-muted relative aspect-square rounded-lg overflow-hidden'>
				{images.length > 0 && (
					<Image
						fill
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
	);
};

export const runtime = 'edge';

export default Product;
