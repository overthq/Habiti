'use client';

import { useQuery, gql } from 'urql';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const ProfilePage = () => {
	const [{ data, fetching }] = useQuery({ query: PROFILE_QUERY });
	const { onLogout } = useAuthContext();

	const handleLogOut = () => {
		onLogout();
	};

	if (fetching) {
		return <div />;
	}

	return (
		<div>
			<h1 className='text-2xl mb-4'>Profile</h1>
			<Button onClick={handleLogOut}>Log Out</Button>
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
