'use client';

import Footer from '@/components/home/Footer';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import { useAuthContext } from '@/contexts/AuthContext';

const Home = () => {
	const { userId } = useAuthContext();

	return (
		<main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<Header />
			<Hero />
			<Footer />
		</main>
	);
};

export default Home;
