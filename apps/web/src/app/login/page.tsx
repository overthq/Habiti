import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useMutation, gql } from 'urql';
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

	const [, login] = useMutation(LOGIN_MUTATION);
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		const { data } = await login({
			input: { email: values.email, password: values.password }
		});
		console.log(data);
	};

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200'>
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
