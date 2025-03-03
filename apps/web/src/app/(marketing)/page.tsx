'use client';

import Hero from '@/components/home/Hero';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// TODO: Rethink the entire authentication logic on the frontend
const Home = () => {
	const { userId, accessToken } = useAuthContext();
	const router = useRouter();

	useEffect(() => {
		if (userId && accessToken) {
			router.push('/home');
		}
	}, [userId, accessToken, router]);

	return (
		<div className='container flex flex-1 flex-col'>
			<Hero />
		</div>
	);
};

export default Home;
