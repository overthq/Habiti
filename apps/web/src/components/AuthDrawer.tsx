import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
	useAppleSignInMutation,
	useAuthenticateMutation,
	useRegisterMutation,
	useVerifyCodeMutation
} from '@/data/mutations';
import {
	AppleSignInCancelled,
	isAppleSignInEnabled,
	prepareAppleSignIn,
	signInWithApple,
	type PreparedAppleSignIn
} from '@/lib/siwa';

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
	// FIXME: Consider moving this back to useState.
	const { currentEmail, setCurrentEmail } = useAuthStore();
	const [mode, setMode] = React.useState<AuthMode>('login');

	const authenticateMutation = useAuthenticateMutation();
	const registerMutation = useRegisterMutation();
	const verifyCodeMutation = useVerifyCodeMutation();

	const onModeToggle = () => {
		setMode(prev => (prev === 'login' ? 'signup' : 'login'));
	};

	const onLoginSubmit = React.useCallback(
		(data: { email: string }) => {
			setCurrentEmail(data.email);

			authenticateMutation.mutate(
				{ email: data.email },
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
			verifyCodeMutation.mutate({
				email: currentEmail,
				code: data.code
			});
		},
		[verifyCodeMutation, currentEmail]
	);

	const value = React.useMemo(
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

	return <AuthDrawerContext value={value}>{children}</AuthDrawerContext>;
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
		<Drawer
			open={authModalOpen}
			onOpenChange={toggleAuthModal}
			repositionInputs={false}
		>
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

const AppleSignInButton = () => {
	const appleSignInMutation = useAppleSignInMutation();
	const [prepared, setPrepared] = React.useState<PreparedAppleSignIn | null>(
		null
	);
	const [popupOpen, setPopupOpen] = React.useState(false);

	const prepare = React.useCallback(() => {
		prepareAppleSignIn()
			.then(setPrepared)
			.catch(() => setPrepared(null));
	}, []);

	React.useEffect(() => {
		prepare();
	}, [prepare]);

	// The popup has to open synchronously from the click, so this calls
	// signInWithApple directly rather than from inside the mutation.
	const handleClick = () => {
		if (!prepared) return;

		setPopupOpen(true);
		setPrepared(null);

		signInWithApple(prepared)
			.then(credentials => appleSignInMutation.mutate(credentials))
			.catch(error => {
				if (!(error instanceof AppleSignInCancelled)) {
					toast.error('Sign in with Apple failed');
				}
			})
			.finally(() => {
				setPopupOpen(false);
				// A nonce is single-use, so get a fresh one for the next attempt.
				prepare();
			});
	};

	return (
		<>
			<Button
				type='button'
				className='w-full bg-black text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85'
				onClick={handleClick}
				disabled={!prepared || popupOpen || appleSignInMutation.isPending}
			>
				<svg viewBox='0 0 814 1000' aria-hidden='true' fill='currentColor'>
					<path d='M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z' />
				</svg>
				Continue with Apple
			</Button>
			<div className='flex items-center gap-3 text-xs text-muted-foreground'>
				<div className='h-px flex-1 bg-border' />
				or
				<div className='h-px flex-1 bg-border' />
			</div>
		</>
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
			{isAppleSignInEnabled() && <AppleSignInButton />}
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
			{isAppleSignInEnabled() && <AppleSignInButton />}
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

			<Button className='w-full mt-4' type='submit'>
				Submit
			</Button>
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
