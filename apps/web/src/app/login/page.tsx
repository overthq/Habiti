'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthenticateMutation } from '@/data/mutations';
import { useAuthStore } from '@/state/auth-store';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

const LoginPage = () => {
	const router = useRouter();

	const authenticateMutation = useAuthenticateMutation();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const { logIn } = useAuthStore();

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		const data = await authenticateMutation.mutateAsync({
			email: values.email,
			password: values.password
		});

		console.log({ data });

		logIn({
			accessToken: data.accessToken,
			userId: data.userId
		});

		// TODO: Handle non-home origin routes.

		router.push('/home');
	};

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<div className='w-full max-w-md'>
				<h1 className='text-2xl font-bold mb-4'>Welcome back.</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} type='password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full'>
							Login
						</Button>
						<div className='mt-4'>
							<p className='text-sm text-gray-600 text-center'>
								Don&apos;t have an account?{' '}
								<Link
									href='/register'
									className='text-blue-600 hover:underline'
								>
									Register here
								</Link>
							</p>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default LoginPage;
