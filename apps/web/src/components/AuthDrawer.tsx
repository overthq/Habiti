'use client';

import React from 'react';
import { Controller } from 'react-hook-form';

import {
	Drawer,
	DrawerHeader,
	DrawerContent,
	DrawerTitle,
	DrawerDescription
} from './ui/drawer';
import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogDescription
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuthStore } from '@/state/auth-store';

type AuthMode = 'login' | 'signup' | 'verify-code';

const AuthDrawer = () => {
	const { authModalOpen, toggleAuthModal } = useAuthStore();
	const [mode, setMode] = React.useState<AuthMode>('login');
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const toggleMode = () =>
		setMode(prev => (prev === 'login' ? 'signup' : 'login'));

	if (isDesktop) {
		return (
			<Dialog open={authModalOpen} onOpenChange={toggleAuthModal}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>{mode === 'login' ? 'Log in' : 'Sign up'}</DialogTitle>
						<DialogDescription>
							{mode === 'login'
								? 'Enter your email to receive a login link.'
								: 'Create an account with just your name and email.'}
						</DialogDescription>
					</DialogHeader>
					{mode === 'login' ? (
						<LoginForm onModeToggle={toggleMode} />
					) : (
						<SignupForm onModeToggle={toggleMode} />
					)}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={authModalOpen} onOpenChange={toggleAuthModal}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{mode === 'login' ? 'Log in' : 'Sign up'}</DrawerTitle>
					<DrawerDescription>
						{mode === 'login'
							? 'Enter your email to receive a login link.'
							: 'Create an account with just your name and email.'}
					</DrawerDescription>
				</DrawerHeader>
				<div className='p-4 pt-0'>
					{mode === 'login' ? (
						<LoginForm onModeToggle={toggleMode} />
					) : (
						<SignupForm onModeToggle={toggleMode} />
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
};

type AuthFormProps = {
	onModeToggle: () => void;
};

const LoginForm = ({ onModeToggle }: AuthFormProps) => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<form className='grid items-start gap-4' onSubmit={handleSubmit}>
			<div className='space-y-2'>
				<Label htmlFor='login-email'>Email</Label>
				<Input
					id='login-email'
					name='email'
					type='email'
					inputMode='email'
					placeholder='jane@example.com'
					autoComplete='email'
				/>
			</div>
			<Button type='submit' className='w-full'>
				Send login link
			</Button>
			<div className='text-center text-sm text-muted-foreground'>
				Need an account?{' '}
				<Button
					variant='link'
					type='button'
					className='p-0 h-auto font-semibold'
					onClick={onModeToggle}
				>
					Sign up
				</Button>
			</div>
		</form>
	);
};

const SignupForm = ({ onModeToggle }: AuthFormProps) => {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<form className='grid items-start gap-4' onSubmit={handleSubmit}>
			<div className='space-y-2'>
				<Label htmlFor='signup-name'>Name</Label>
				<Input
					id='signup-name'
					name='name'
					placeholder='Jane Doe'
					autoComplete='name'
				/>
			</div>
			<div className='space-y-2'>
				<Label htmlFor='signup-email'>Email</Label>
				<Input
					id='signup-email'
					name='email'
					type='email'
					inputMode='email'
					placeholder='jane@example.com'
					autoComplete='email'
				/>
			</div>
			<Button type='submit' className='w-full'>
				Create account
			</Button>
			<div className='text-center text-sm text-muted-foreground'>
				Already have an account?{' '}
				<Button
					variant='link'
					type='button'
					className='p-0 h-auto font-semibold'
					onClick={onModeToggle}
				>
					Log in
				</Button>
			</div>
		</form>
	);
};

export default AuthDrawer;
