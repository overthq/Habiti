'use client';

import Link from 'next/link';
import React from 'react';

import { formatNaira } from '@/utils/currency';
import { cn } from '@/lib/utils';

interface ProductProps {
	id: string;
	name: string;
	unitPrice: number;
	imagePath?: string;
	inGrid?: boolean;
}

const Product: React.FC<ProductProps> = ({
	id,
	name,
	unitPrice,
	imagePath,
	inGrid = false
}) => {
	return (
		<Link href={`/product/${id}`}>
			<div key={id} className={cn(!inGrid && 'w-[150px] md:w-[200px]')}>
				<div className='bg-muted aspect-square rounded-lg overflow-hidden'>
					{imagePath && (
						<img
							src={imagePath}
							alt={name}
							className='size-full object-cover'
						/>
					)}
				</div>
				<div className='text-sm mt-2'>
					<p className='font-medium'>{name}</p>
					<p className='text-muted-foreground'>{formatNaira(unitPrice)}</p>
				</div>
			</div>
		</Link>
	);
};

export const runtime = 'edge';

export default Product;
