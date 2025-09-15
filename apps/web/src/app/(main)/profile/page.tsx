'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCurrentUserQuery } from '@/data/queries';
import { useAuthStore } from '@/state/auth-store';

const ProfilePage = () => {
	const { data, isLoading } = useCurrentUserQuery();
	const { logOut } = useAuthStore();
	const router = useRouter();

	const handleLogOut = () => {
		logOut();
		router.push('/');
	};

	if (isLoading || !data) {
		return <div />;
	}

	return (
		<div>
			<h1 className='text-2xl font-medium mb-4'>Profile</h1>

			<div className='bg-secondary rounded-md p-4 mb-4'>
				<p className='text-xl font-medium'>{data.user.name}</p>
				<p className='text-sm text-muted-foreground'>{data.user.email}</p>
			</div>

			<Button onClick={handleLogOut}>Log Out</Button>
		</div>
	);
};

export const runtime = 'edge';

export default ProfilePage;
