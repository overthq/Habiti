'use client';

import Link from 'next/link';
import { gql, useQuery } from 'urql';

import Header from '@/components/home/Header';
import { formatNaira } from '@/utils/currency';

const EXPLORE_QUERY = gql`
	query Explore {
		stores {
			id
			name
			image {
				id
				path
			}
		}

		products {
			id
			name
			unitPrice
			images {
				id
				path
			}
		}
	}
`;

const ExplorePage = () => {
	const [{ data, fetching }] = useQuery({ query: EXPLORE_QUERY });

	if (fetching) return <div>Loading...</div>;

	return (
		<div>
			<Header />

			<div className='container mx-auto max-w-4xl px-4'>
				<h1 className='text-3xl font-bold mb-6'>Explore</h1>

				<h2 className='text-xl font-medium mb-4 text-gray-600'>
					Trending Stores
				</h2>

				{data?.stores?.length > 0 ? (
					<div>
						{data.stores.map((store: any) => (
							<Link
								key={store.id}
								href={`/store/${store.id}`}
								className='inline-block'
							>
								<div className='w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
									{store.image ? (
										<img
											src={store.image.path}
											alt={store.name}
											className='w-full h-full object-cover'
										/>
									) : (
										<span className='text-gray-400 text-2xl'>
											{store.name.charAt(0)}
										</span>
									)}
								</div>
								<div className='text-center mt-2'>{store.name}</div>
							</Link>
						))}
					</div>
				) : (
					<p>No stores found.</p>
				)}

				<h2 className='text-xl font-medium mb-4 mt-8 text-gray-600'>
					Featured Products
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
					{data.products.map((product: any) => (
						<Link
							key={product.id}
							href={`/product/${product.id}`}
							className='bg-white rounded-lg'
						>
							<img
								src={product.images[0].path}
								alt={product.name}
								className='w-full h-40 object-cover rounded-md mb-2'
							/>
							<h3 className='text-lg font-medium'>{product.name}</h3>
							<p className='text-gray-600'>{formatNaira(product.unitPrice)}</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default ExplorePage;
