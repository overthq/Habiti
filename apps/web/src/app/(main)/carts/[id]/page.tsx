'use client';

import { Button } from '@/components/ui/button';
import { formatNaira } from '@/utils/currency';
import { useParams } from 'next/navigation';
import { gql, useMutation, useQuery } from 'urql';

const CartPage = () => {
	const { id } = useParams();
	const [{ data, fetching, error }] = useQuery({
		query: CART_QUERY,
		variables: { id }
	});

	const [, createOrder] = useMutation(CREATE_ORDER);

	const handlePlaceOrder = () => {
		if (data) {
			createOrder({
				input: {
					cartId: id,
					cardId: data.cart.user.cards[0].id,
					transactionFee: data.cart.fees.transaction,
					serviceFee: data.cart.fees.service
				}
			});
		}
	};

	if (fetching) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1 className='text-2xl mb-4'>Cart</h1>

			{data.cart.products.map((product: any) => (
				<div
					key={product.id}
					className='flex items-center gap-4 p-4 border rounded-md mb-6'
				>
					<div className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center'>
						{product.product.images[0] && (
							<img
								src={product.product.images[0].path}
								alt={product.product.name}
								className='w-16 h-16 object-cover rounded'
								loading='lazy'
								onLoad={e =>
									e.currentTarget.parentElement?.classList.remove('bg-gray-200')
								}
							/>
						)}
					</div>
					<div className='flex-1'>
						<p className='font-medium'>{product.product.name}</p>
						<p className='text-gray-600'>
							{formatNaira(product.product.unitPrice)}
						</p>
					</div>
				</div>
			))}

			<div className='mb-4'>
				<div className='flex justify-between'>
					<p>Subtotal</p>
					<p>{formatNaira(data.cart.total)}</p>
				</div>
				<div className='flex justify-between'>
					<p>Transaction Fee</p>
					<p>{formatNaira(data.cart.fees.transaction)}</p>
				</div>
				<div className='flex justify-between'>
					<p>Service Fee</p>
					<p>{formatNaira(data.cart.fees.service)}</p>
				</div>
				<div className='flex justify-between'>
					<p>Total</p>
					<p>{formatNaira(data.cart.fees.total + data.cart.total)}</p>
				</div>
			</div>

			<Button onClick={handlePlaceOrder}>Place Order</Button>
		</div>
	);
};

const CART_QUERY = gql`
	query Cart($id: ID!) {
		cart(id: $id) {
			id
			userId
			user {
				id
				cards {
					id
					email
					cardType
					last4
				}
			}
			storeId
			store {
				id
				name
			}
			products {
				cartId
				productId
				product {
					id
					name
					unitPrice
					storeId
					images {
						id
						path
					}
				}
				quantity
			}
			total
			fees {
				transaction
				service
				total
			}
		}
	}
`;

const CREATE_ORDER = gql`
	mutation CreateOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			id
			store {
				id
				name
			}
			products {
				product {
					id
					name
				}
				unitPrice
				quantity
			}
			total
		}
	}
`;

export default CartPage;
