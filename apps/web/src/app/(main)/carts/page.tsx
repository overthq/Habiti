'use client';

import Link from 'next/link';
import { formatNaira } from '@/utils/currency';
import { useCartsQuery } from '@/data/queries';
import { Button } from '@/components/ui/button';

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
		<div>
			<h1 className='text-2xl font-medium mb-4'>Carts</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{data.carts.map(cart => (
					<div key={cart.id} className='border bg-white rounded-lg p-6'>
						<h2 className='text-xl font-semibold mb-4'>{cart.store.name}</h2>
						<div className='space-y-2 mb-4'>
							{cart.products.map(product => (
								<div
									key={product.productId}
									className='flex justify-between text-sm text-gray-600'
								>
									<span>{product.product.name}</span>
									<span>
										{product.quantity} ×{' '}
										{formatNaira(product.product.unitPrice)}
									</span>
								</div>
							))}
						</div>
						<div className='flex flex-col gap-2'>
							<Button asChild>
								<Link href={`/carts/${cart.id}`}>View cart</Link>
							</Button>
							<Button variant='secondary' asChild>
								<Link href={`/stores/${cart.storeId}`}>Visit store</Link>
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CartsPage;
