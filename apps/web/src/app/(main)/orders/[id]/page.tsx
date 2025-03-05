'use client';

import { gql, useQuery } from 'urql';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatNaira } from '@/utils/currency';

const ORDER_QUERY = gql`
	query Order($id: ID!) {
		order(id: $id) {
			id
			storeId
			products {
				orderId
				productId
				product {
					id
					name
					unitPrice
					quantity
					images {
						id
						path
					}
				}
			}
		}
	}
`;

const OrderPage = () => {
	const { id } = useParams<{ id: string }>();
	const [{ data, fetching, error }] = useQuery({
		query: ORDER_QUERY,
		variables: { id }
	});

	if (fetching) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error loading order: {error.message}</p>;
	}

	const order = data?.order;
	if (!order) {
		return <p>Order not found</p>;
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-6'>
				<Link
					href={`/store/${order.storeId}`}
					className='text-blue-600 hover:text-blue-800 flex items-center gap-2'
				>
					<ArrowLeft className='size-4' />
					Back to Store
				</Link>
			</div>

			<div className='bg-white rounded-lg shadow-md p-6'>
				<h1 className='text-2xl font-bold mb-6'>Order Details</h1>

				<div className='space-y-6'>
					{order.products.map((item: any) => (
						<div
							key={item.productId}
							className='flex items-start gap-4 border-b pb-4 last:border-b-0'
						>
							{item.product.images?.[0] && (
								<img
									src={item.product.images[0].path}
									alt={item.product.name}
									className='w-24 h-24 object-cover rounded-md'
								/>
							)}
							<div className='flex-1'>
								<h2 className='text-lg font-semibold'>{item.product.name}</h2>
								<div className='mt-2 text-gray-600'>
									<p>Unit Price: {formatNaira(item.product.unitPrice)}</p>
									<p>Quantity: {item.product.quantity}</p>
									<p className='font-medium'>
										Total:{' '}
										{formatNaira(
											item.product.unitPrice * item.product.quantity
										)}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default OrderPage;
