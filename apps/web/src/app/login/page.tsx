'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, gql } from 'urql';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

const LoginPage = () => {
	const LOGIN_MUTATION = gql`
		mutation Login($input: AuthenticateInput!) {
			authenticate(input: $input) {
				accessToken
				userId
			}
		}
	`;

	const [loginResult, login] = useMutation(LOGIN_MUTATION);
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const onSubmit = (values: z.infer<typeof loginSchema>) => {
		console.log(values);
		login({ input: { email: values.email, password: values.password } });
	};

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold mb-4">Login</h1>
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
				<Button type='submit' className='w-full'>Login</Button>
					<div className="mt-4">
						<p className="text-sm text-gray-600 text-center">
							Don't have an account?{' '}
							<Link href="/register" className="text-blue-600 hover:underline">
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

export const runtime = 'edge';

export default LoginPage;
