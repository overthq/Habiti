'use client';

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

const registerSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(8)
});

const RegisterPage = () => {
	const REGISTER_MUTATION = gql`
		mutation Register($name: String!, $email: String!, $password: String!) {
			register(name: $name, email: $email, password: $password) {
				token
				user {
					id
					email
				}
			}
		}
	`;

	const [registerResult, register] = useMutation(REGISTER_MUTATION);

	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	});

	const onSubmit = (values: z.infer<typeof registerSchema>) => {
		console.log(values);
	};

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200'>
				<h1 className='text-2xl font-bold mb-4'>Create your account.</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} type='email' />
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
							Register
						</Button>
						<div className='mt-4'>
							<p className='text-sm text-gray-600 text-center'>
								Already have an account?{' '}
								<Link href='/login' className='text-blue-600 hover:underline'>
									Login here
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

export default RegisterPage;
