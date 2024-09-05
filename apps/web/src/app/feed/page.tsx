'use client';
import { gql, useQuery } from 'urql';

import Header from '@/components/home/Header';

const FEED_QUERY = gql`
	query Feed {
		currentUser {
			id
			orders {
				id
				store {
					id
					name
				}
			}

			followed {
				id
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
		}
	}
`;

const FeedPage = () => {
	const [{ data, fetching }] = useQuery({ query: FEED_QUERY });

	console.log({ data, fetching });
	if (fetching) return <div>Loading...</div>;

	return (
		<div>
			<Header />
			<h2>Recent Orders</h2>
			{data?.currentUser?.orders?.length > 0 ? (
				<ul>
					{data.currentUser.orders.map((order: any) => (
						<li key={order.id}>
							Order from {order.store.name} (Order ID: {order.id})
						</li>
					))}
				</ul>
			) : (
				<p>No recent orders found.</p>
			)}

			<h2>Followed Stores</h2>
			{data?.currentUser?.followed?.length > 0 ? (
				<ul>
					{data.currentUser.followed.map((store: any) => (
						<li key={store.id}>{store.store.name}</li>
					))}
				</ul>
			) : (
				<p>No followed stores found.</p>
			)}
		</div>
	);
};

export default FeedPage;
