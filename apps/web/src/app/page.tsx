'use client';

import React from 'react';

import NewFooter from '@/components/home/NewFooter';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const Home = () => {
	return (
		<div className='flex flex-col h-dvh'>
			<div className='flex flex-1 mx-auto w-full gap-8 max-w-200 flex-col-reverse py-4 md:flex-row'>
				<div className='flex flex-1'>
					<div className='flex justify-center items-center w-full'>
						<Image
							src='/images/landing-image.webp'
							alt='Habiti store page screenshot'
							width={295}
							height={606}
						/>
					</div>
				</div>
				<div className='flex flex-1 flex-col justify-center p-8 pt-14 md:p-0 md:pt-0'>
					<Image
						src='/images/habiti-wordmark-black.svg'
						alt='Habiti'
						height={36}
						width={120}
						className='dark:invert mb-8'
					/>
					<h2 className='text-4xl mb-4 font-semibold'>
						Online shopping, simplified.
					</h2>
					<p className='text-lg mb-4 text-muted-foreground'>
						Habiti helps shoppers and merchants manage their shopping activity
						in one place.
					</p>
					<div className='flex flex-col space-y-2'>
						<Button asChild>
							<Link href='/register'>Sign up</Link>
						</Button>
						<Button variant='secondary' asChild>
							<Link href='/login'>Log in</Link>
						</Button>
					</div>
				</div>
			</div>
			<NewFooter />
		</div>
	);
};

export default Home;
