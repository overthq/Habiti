'use client';

import Footer from '@/components/home/Footer';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';

const Home = () => {
	return (
		<main className='flex flex-col h-screen'>
			<Header />
			<Hero />
			<Footer />
		</main>
	);
};

export default Home;
