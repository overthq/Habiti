'use client';

import { useQuery, gql } from 'urql';

const ProfilePage = () => {
	const [{ data, fetching }] = useQuery({ query: PROFILE_QUERY });

	if (fetching) {
		return <div />;
	}

	return (
		<div>
			<h1>Profile</h1>
		</div>
	);
};

export const runtime = 'edge';

const PROFILE_QUERY = gql`
	query Profile {
		currentUser {
			id
			email
		}
	}
`;

export default ProfilePage;
