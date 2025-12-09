'use client';

import Link from 'next/link';
import React from 'react';

import { formatNaira } from '@/utils/currency';

interface ProductProps {
	id: string;
	name: string;
	unitPrice: number;
	imagePath?: string;
}

const Product: React.FC<ProductProps> = ({
	id,
	name,
	unitPrice,
	imagePath
}) => {
	return (
		<Link href={`/product/${id}`}>
			<div key={id} className='min-w-[150px]'>
				<div className='bg-muted aspect-square rounded-lg overflow-hidden'>
					{imagePath && (
						<img
							src={imagePath}
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
