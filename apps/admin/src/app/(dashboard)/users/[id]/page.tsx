'use client';

import React from 'react';
import { useUserQuery } from '@/data/queries/users';

// TODO:
// - Add a form to update the user
// - Followed stores
// - Managed stores
// - Orders
// - Total order volume (general overview)

const UserDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = React.use(params);
	const { data: userData, isLoading: isLoadingUser } = useUserQuery(id);

	if (isLoadingUser) {
		return <div>Loading...</div>;
	}

	const user = userData?.user;

	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
			<p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
			<p>Last updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
		</div>
	);
};

export default UserDetailPage;

export const runtime = 'edge';
