'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

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
						<CardTitle>Glad you&apos;re here</CardTitle>
						<CardDescription>Create your Habiti account</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-4'
							>
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
								<div className='mt-2'>
									<p className='text-sm text-gray-600 text-center'>
										Already have an account?{' '}
										<Link
											href='/login'
											className='underline underline-offset-4'
										>
											Login here
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

export default RegisterPage;
