'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

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
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuthStore } from '@/state/auth-store';
import { Field, FieldError, FieldLabel } from './ui/field';

type AuthMode = 'login' | 'signup' | 'verify-code';

const DrawerDetailsByAuthMode = {
	login: {
		title: 'Log in',
		description: 'Enter your email to receive a verification code.'
	},
	signup: {
		title: 'Sign up',
		description: 'Create an account with just your name and email.'
	},
	'verify-code': {
		title: 'Verify your code',
		description: 'Enter the verification code sent to your email'
	}
} as const;

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
						<DialogTitle>{DrawerDetailsByAuthMode[mode].title}</DialogTitle>
						<DialogDescription>
							{DrawerDetailsByAuthMode[mode].description}
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
					<DrawerTitle>{DrawerDetailsByAuthMode[mode].title}</DrawerTitle>
					<DrawerDescription>
						{DrawerDetailsByAuthMode[mode].description}
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
	const form = useForm({
		defaultValues: {
			email: ''
		}
	});

	const onSubmit = (data: { email: string }) => {
		console.log(data);
	};

	return (
		<form
			className='grid items-start gap-4'
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<Controller
				name='email'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor='email'>Email</FieldLabel>
						<Input
							{...field}
							id={field.name}
							type='email'
							inputMode='email'
							aria-invalid={fieldState.invalid}
							placeholder='jane@example.com'
							autoComplete='email'
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
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
	const form = useForm({
		defaultValues: {
			name: '',
			email: ''
		}
	});

	const onSubmit = (data: { name: string; email: string }) => {
		console.log(data);
	};

	return (
		<form
			className='grid items-start gap-4'
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<Controller
				name='name'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor='name'>Name</FieldLabel>
						<Input
							{...field}
							id={field.name}
							aria-invalid={fieldState.invalid}
							placeholder='Jane Doe'
							autoComplete='name'
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			<Controller
				name='email'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor='email'>Email</FieldLabel>
						<Input
							{...field}
							id={field.name}
							type='email'
							inputMode='email'
							aria-invalid={fieldState.invalid}
							placeholder='jane@example.com'
							autoComplete='email'
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
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

interface VerificationFormProps {
	onModeToggle(): void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
	onModeToggle
}) => {
	const form = useForm({
		defaultValues: {
			code: ''
		}
	});

	const onSubmit = () => {};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<Controller
				name='code'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor='code'>Verification code</FieldLabel>
						<Input
							{...field}
							id={field.name}
							aria-invalid={fieldState.invalid}
							placeholder='000000'
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</form>
	);
};

export default AuthDrawer;
