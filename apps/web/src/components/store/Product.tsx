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
				{images.length > 0 && (
					<img
						src={images[0].path}
						alt={name}
						className='w-full h-48 object-cover rounded-lg'
					/>
				)}
				<div className='mt-4'>
					<h2 className='text-xl font-semibold mb-2'>{name}</h2>
					<p className='text-gray-600'>{formatNaira(unitPrice)}</p>
				</div>
			</div>
		</Link>
	);
};

export const runtime = 'edge';

export default Product;
