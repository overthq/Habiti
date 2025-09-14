'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import Hero from '@/components/home/Hero';
import { useAuthStore } from '@/state/auth-store';

// TODO: Rethink the entire authentication logic on the frontend
const Home = () => {
	const { userId, accessToken } = useAuthStore();
	const router = useRouter();

	React.useEffect(() => {
		if (userId && accessToken) {
			router.push('/home');
		}
	}, [userId, accessToken, router]);

	return (
		<div className='container flex flex-1 flex-col'>
			<Hero />
			<section className='py-12 border-t'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
					<div className='space-y-2'>
						<h3 className='text-base font-semibold'>Unified shopping</h3>
						<p className='text-sm text-muted-foreground'>
							Track orders, carts, and wishlists across stores from a single
							dashboard.
						</p>
					</div>
					<div className='space-y-2'>
						<h3 className='text-base font-semibold'>For merchants</h3>
						<p className='text-sm text-muted-foreground'>
							Manage products, inventory, and support in a lightweight
							workspace.
						</p>
					</div>
					<div className='space-y-2'>
						<h3 className='text-base font-semibold'>Privacy first</h3>
						<p className='text-sm text-muted-foreground'>
							We collect the minimum needed and put you in control of your data.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
