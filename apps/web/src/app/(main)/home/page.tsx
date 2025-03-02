'use client';

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
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export default HomePage;
