'use client';

import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateAdminMutation } from '@/data/mutations/auth';

export default function SignupPage() {
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const { mutateAsync: createAdmin } = useCreateAdminMutation();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await createAdmin({ name, email, password });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800'>
				<div className='space-y-2 text-center'>
					<h1 className='text-3xl font-bold'>Create Admin Account</h1>
					<p className='text-gray-500 dark:text-gray-400'>
						Enter your details to get started
					</p>
				</div>
				<form className='space-y-4' onSubmit={handleSubmit}>
					<div className='space-y-2'>
						<label htmlFor='name' className='text-sm font-medium'>
							Full Name
						</label>
						<Input
							id='name'
							type='text'
							required
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<label htmlFor='email' className='text-sm font-medium'>
							Email
						</label>
						<Input
							id='email'
							type='email'
							placeholder='name@example.com'
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<label htmlFor='password' className='text-sm font-medium'>
							Password
						</label>
						<Input
							id='password'
							type='password'
							required
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<Button type='submit' className='w-full'>
						Create Account
					</Button>
				</form>
				<div className='text-center text-sm'>
					<span className='text-gray-500 dark:text-gray-400'>
						Already have an account?{' '}
					</span>
					<Link href='/login' className='text-primary hover:underline'>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
