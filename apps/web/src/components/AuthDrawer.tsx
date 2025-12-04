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
import {
	useAuthenticateMutation,
	useRegisterMutation,
	useVerifyCodeMutation
} from '@/data/mutations';

type AuthMode = 'login' | 'signup' | 'verify-code';

interface AuthDrawerContextValue {
	onLoginSubmit: (data: { email: string }) => void;
	onRegisterSubmit: (data: { name: string; email: string }) => void;
	onVerifyCodeSubmit: (data: { code: string }) => void;
	mode: AuthMode;
	setMode: (mode: AuthMode) => void;
	onModeToggle(): void;
}

const AuthDrawerContext = React.createContext<AuthDrawerContextValue | null>(
	null
);

const useAuthDrawerContext = () => {
	const context = React.useContext(AuthDrawerContext);
	if (!context) {
		throw new Error(
			'useAuthDrawerContext must be used within AuthDrawerProvider'
		);
	}
	return context;
};

const AuthDrawerProvider: React.FC<React.PropsWithChildren> = ({
	children
}) => {
	// FIXME: Rename for collision-sake
	const [currentEmail, setCurrentEmail] = React.useState('');
	const [mode, setMode] = React.useState<AuthMode>('login');

	const authenticateMutation = useAuthenticateMutation();
	const registerMutation = useRegisterMutation();
	const verifyCodeMutation = useVerifyCodeMutation();

	const onModeToggle = () => {
		console.log('toggling');

		setMode(prev => {
			console.log({ prev });
			return prev === 'login' ? 'signup' : 'login';
		});
	};

	const onLoginSubmit = React.useCallback(
		(data: { email: string }) => {
			setCurrentEmail(currentEmail);
			authenticateMutation.mutate(
				{ email: currentEmail },
				{
					onSuccess: () => {
						setMode('verify-code');
					}
				}
			);
		},
		[authenticateMutation]
	);

	const onRegisterSubmit = React.useCallback(
		(data: { name: string; email: string }) => {
			setCurrentEmail(data.email);

			registerMutation.mutate(
				{ name: data.name, email: data.email },
				{
					onSuccess: () => {
						setMode('verify-code');
					}
				}
			);
		},
		[registerMutation]
	);

	const onVerifyCodeSubmit = React.useCallback(
		(data: { code: string }) => {
			verifyCodeMutation.mutate({ email: currentEmail, code: data.code });
		},
		[verifyCodeMutation]
	);

	const contextValue = React.useMemo(
		() => ({
			onLoginSubmit,
			onRegisterSubmit,
			onVerifyCodeSubmit,
			mode,
			setMode,
			onModeToggle
		}),
		[onLoginSubmit, onRegisterSubmit, onVerifyCodeSubmit, onModeToggle, mode]
	);

	return <AuthDrawerContext value={contextValue}>{children}</AuthDrawerContext>;
};

const AuthDrawerWrapper = () => {
	return (
		<AuthDrawerProvider>
			<AuthDrawer />
		</AuthDrawerProvider>
	);
};

const AuthDrawer = () => {
	const { authModalOpen, toggleAuthModal } = useAuthStore();
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const { mode } = useAuthDrawerContext();

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
					{DrawerDetailsByAuthMode[mode].content}
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
				<div className='p-4 pt-0'>{DrawerDetailsByAuthMode[mode].content}</div>
			</DrawerContent>
		</Drawer>
	);
};

const LoginForm = () => {
	const form = useForm({
		defaultValues: {
			email: ''
		}
	});

	const { onModeToggle, onLoginSubmit } = useAuthDrawerContext();

	const onSubmit = (data: { email: string }) => {
		onLoginSubmit(data);
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

const SignupForm = () => {
	const form = useForm({
		defaultValues: {
			name: '',
			email: ''
		}
	});
	const { onRegisterSubmit, onModeToggle } = useAuthDrawerContext();

	const onSubmit = (data: { name: string; email: string }) => {
		onRegisterSubmit(data);
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

const VerificationForm: React.FC = () => {
	const form = useForm({
		defaultValues: {
			code: ''
		}
	});

	const { onVerifyCodeSubmit } = useAuthDrawerContext();

	const onSubmit = (data: { code: string }) => {
		onVerifyCodeSubmit(data);
	};

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

const DrawerDetailsByAuthMode = {
	login: {
		title: 'Log in',
		description: 'Enter your email to receive a verification code.',
		content: <LoginForm />
	},
	signup: {
		title: 'Sign up',
		description: 'Create an account with just your name and email.',
		content: <SignupForm />
	},
	'verify-code': {
		title: 'Verify your code',
		description: 'Enter the verification code sent to your email',
		content: <VerificationForm />
	}
} as const;

export default AuthDrawerWrapper;
