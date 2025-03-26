import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/data/mutations';
const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

const Login = () => {
	const loginMutation = useLoginMutation();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const onSubmit = (data: z.infer<typeof loginSchema>) => {
		loginMutation.mutate(data);
	};

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
									<Input type='password' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type='submit' disabled={loginMutation.isPending}>
						Login
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default Login;
