'use client';
import Link from 'next/link';
import { gql, useQuery } from 'urql';

import Header from '@/components/home/Header';

const EXPLORE_QUERY = gql`
	query Explore {
		stores {
			id
			name
		}
	}
`;

const ExplorePage = () => {
	const [{ data, fetching }] = useQuery({ query: EXPLORE_QUERY });

	console.log({ data, fetching });

	if (fetching) return <div>Loading...</div>;

	return (
		<div>
			<Header />

			<h1>Explore</h1>

			{data?.stores?.length > 0 ? (
				<ul>
					{data.stores.map((store: any) => (
						<li key={store.id}>
							<Link href={`/store/${store.id}`}>{store.name}</Link>
						</li>
					))}
				</ul>
			) : (
				<p>No stores found.</p>
			)}
		</div>
	);
};

export default ExplorePage;
