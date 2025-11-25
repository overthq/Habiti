'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

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

		logIn({
			accessToken: data.accessToken
		});

		router.push('/home');
	};

	return (
		<div className='flex flex-col flex-1 justify-center items-center'>
			<Link href='/' className='flex items-center gap-2 mb-4'>
				<Image
					src='/images/habiti-wordmark-black.svg'
					alt='Habiti'
					height={36}
					width={120}
					className='dark:invert'
				/>
			</Link>
			<div className='w-full max-w-md'>
				<Card>
					<CardHeader>
						<CardTitle>Welcome back</CardTitle>
						<CardDescription>Login to your Habiti account</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-4'
							>
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
								<div className='mt-2'>
									<p className='text-sm text-center'>
										Don&apos;t have an account?{' '}
										<Link
											href='/register'
											className='underline underline-offset-4'
										>
											Register here
										</Link>
									</p>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;
