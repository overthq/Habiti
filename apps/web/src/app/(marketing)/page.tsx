'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import Hero from '@/components/home/Hero';
import { useAuthContext } from '@/contexts/AuthContext';

// TODO: Rethink the entire authentication logic on the frontend
const Home = () => {
	const { loading, userId, accessToken } = useAuthContext();
	const router = useRouter();

	React.useEffect(() => {
		if (!loading && userId && accessToken) {
			router.push('/home');
		}
	}, [userId, accessToken, loading, router]);

	if (loading) {
		return <div />;
	}

	return (
		<div className='container flex flex-1 flex-col'>
			<Hero />
		</div>
	);
};

export default Home;
