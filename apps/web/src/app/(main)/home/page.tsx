'use client';

import Link from 'next/link';
import { gql, useQuery } from 'urql';

const HOME_QUERY = gql`
	query Home {
		currentUser {
			id

			orders {
				id
				store {
					id
					name
					image {
						id
						path
					}
				}

				products {
					orderId
					productId
					product {
						id
						name
					}
					unitPrice
					quantity
				}
				total
				status
				createdAt
			}

			followed {
				storeId
				followerId
				store {
					id
					name
					image {
						id
						path
					}
				}
			}

			watchlist {
				userId
				productId
				product {
					id
					name
					unitPrice
					store {
						id
						name
					}
					images {
						id
						path
					}
				}
			}
		}
	}
`;

const HomePage = () => {
	const [{ error, data, fetching }] = useQuery({ query: HOME_QUERY });

	if (fetching) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className='container mx-auto'>
			<h1>Home</h1>
			<h2>Orders</h2>
			<div>
				{data.currentUser.orders.map((order: any) => (
					<div key={order.id}>
						<h2>{order.store.name}</h2>
						{order.products.map((product: any) => (
							<div key={product.productId}>
								<h3>{product.product.name}</h3>
								<p>Price: {product.unitPrice}</p>
								<p>Quantity: {product.quantity}</p>
							</div>
						))}
						<p>Total: {order.total}</p>
						<p>Status: {order.status}</p>
						<p>Created At: {order.createdAt}</p>
						<Link href={`/orders/${order.id}`}>View Order</Link>
					</div>
				))}
			</div>
			<h2>Followed Stores</h2>
			<div>
				{data.currentUser.followed.map((followed: any) => (
					<div key={followed.store.id}>
						<h2>{followed.store.name}</h2>
						<image href={followed.store.image?.path} />
					</div>
				))}
			</div>
		</div>
	);
};

export default HomePage;
