'use client';
import Link from 'next/link';
import { useCartsQuery } from '@/data/queries';
import { Button } from '@/components/ui/button';

const buildProductNamesString = (
	products: Array<{ product: { name: string } }>,
	maxLength = 60
): string => {
	let productNames = '';
	let visibleCount = 0;

	for (let i = 0; i < products.length; i++) {
		const name = products[i].product.name;
		const separator = i === 0 ? '' : ', ';
		const testString = productNames + separator + name;

		if (testString.length <= maxLength) {
			productNames = testString;
			visibleCount = i + 1;
		} else {
			break;
		}
	}

	const remainingCount = products.length - visibleCount;
	return remainingCount > 0
		? `${productNames} and ${remainingCount} more item${remainingCount === 1 ? '' : 's'}`
		: productNames;
};

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

	if (data.carts.length === 0) {
		return (
			<div>
				<h1 className='text-2xl font-medium mb-4'>Carts</h1>
				<div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
					<div className='text-6xl mb-4'>🛒</div>
					<h2 className='text-xl font-semibold mb-2'>No carts yet</h2>
					<p className='text-muted-foreground mb-6'>
						Start shopping to add items to your cart
					</p>
					<Button asChild>
						<Link href='/home'>Browse stores</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1 className='text-2xl font-medium mb-4'>Carts</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{data.carts.map(cart => (
					<div key={cart.id} className='border rounded-lg p-6'>
						<div className='flex items-center gap-2 mb-4'>
							<div className='size-10 rounded-full bg-muted'>
								{cart.store.image && (
									<img
										src={cart.store.image.path}
										alt={cart.store.name}
										className='size-full object-cover'
									/>
								)}
							</div>
							<h2 className='text-xl font-medium'>{cart.store.name}</h2>
						</div>

						<p className='text-sm text-muted-foreground mb-3'>
							{buildProductNamesString(cart.products)}
						</p>
						<div className='flex gap-2 mb-4 overflow-hidden'>
							{cart.products.slice(0, 4).map((product, index) => {
								const isLastTile = index === 3 && cart.products.length > 4;
								const hiddenCount = cart.products.length - 4;

								if (isLastTile) {
									return (
										<div
											key={product.productId}
											className='relative w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0'
										>
											<span className='text-sm font-semibold text-muted-foreground'>
												+{hiddenCount}
											</span>
										</div>
									);
								}

								return (
									<div
										key={product.productId}
										className='relative size-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0'
									>
										{product.product.images?.[0] ? (
											<img
												src={product.product.images[0].path}
												alt={product.product.name}
												className='size-full object-cover'
											/>
										) : (
											<div className='size-full flex items-center justify-center text-gray-400 text-xs'></div>
										)}
									</div>
								);
							})}
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
