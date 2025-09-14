'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
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
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/data/mutations';

const registerSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(8)
});

const RegisterPage = () => {
	const router = useRouter();

	const registerMutation = useRegisterMutation();

	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	});

	const onSubmit = async (values: z.infer<typeof registerSchema>) => {
		const { error } = await registerMutation.mutateAsync({
			name: values.name,
			email: values.email,
			password: values.password
		});

		if (error) {
			console.error(error);
		} else {
			router.push('/login');
		}
	};

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<div className='w-full max-w-md'>
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

export default RegisterPage;
