'use client';

import { Button } from '@/components/ui/button';
import { useCurrentUserQuery } from '@/data/queries';
import { useAuthStore } from '@/state/auth-store';

const ProfilePage = () => {
	const { data, isLoading } = useCurrentUserQuery();
	const { logOut } = useAuthStore();

	if (isLoading || !data) {
		return <div />;
	}

	return (
		<div>
			<h1 className='text-2xl mb-4'>Profile</h1>
			<Button onClick={logOut}>Log Out</Button>
		</div>
	);
};

export const runtime = 'edge';

export default ProfilePage;
