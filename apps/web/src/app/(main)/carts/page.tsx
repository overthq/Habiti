'use client';

import Link from 'next/link';
import { formatNaira } from '@/utils/currency';
import { useCartsQuery } from '@/data/queries';

const CartsPage = () => {
	const { data, isLoading, error } = useCartsQuery();

	if (isLoading || !data)
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
			</div>
		);

	if (error)
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<div className='text-red-500'>Error: {error.message}</div>
			</div>
		);

	return (
		<div className='container mx-auto px-4'>
			<h1 className='text-3xl font-bold mb-8'>Carts</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{data.carts.map(cart => (
					<div key={cart.id} className='border bg-white rounded-lg p-6'>
						<h2 className='text-xl font-semibold mb-4'>{cart.store.name}</h2>
						<div className='space-y-2 mb-4'>
							{cart.products.map((item: any) => (
								<div
									key={item.productId}
									className='flex justify-between text-sm text-gray-600'
								>
									<span>{item.product.name}</span>
									<span>
										{item.quantity} × {formatNaira(item.product.unitPrice)}
									</span>
								</div>
							))}
						</div>
						<Link
							href={`/carts/${cart.id}`}
							className='inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200'
						>
							View Cart
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default CartsPage;
