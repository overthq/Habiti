import { gql, useQuery } from 'urql';

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
		}
	}
`;

const FeedPage = () => {
	const [{ data, fetching }] = useQuery({ query: FEED_QUERY });

	if (fetching) return <div>Loading...</div>;

	return <div>Feed</div>;
};

export default FeedPage;
