import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const SomeDescription = () => {
	return (
		<div className='flex flex-col flex-1 h-full justify-center p-8'>
			<h1 className='text-4xl font-semibold tracking-tight'>
				Online shopping, simplified.
			</h1>
			<p className='mt-3 text-lg text-muted-foreground'>
				Habiti helps shoppers and merchants manage their shopping activity in
				one place.
			</p>
		</div>
	);
};

const LoginForm = ({ className, ...props }: React.ComponentProps<'form'>) => {
	return (
		<form className={cn('flex flex-col gap-6', className)} {...props}>
			<div className='flex flex-col items-center gap-2 text-center'>
				<h1 className='text-2xl font-bold'>Login to your account</h1>
				<p className='text-muted-foreground text-sm text-balance'>
					Enter your email below to login to your account
				</p>
			</div>
			<div className='grid gap-6'>
				<div className='grid gap-3'>
					<Label htmlFor='email'>Email</Label>
					<Input id='email' type='email' placeholder='m@example.com' required />
				</div>
				<div className='grid gap-3'>
					<div className='flex items-center'>
						<Label htmlFor='password'>Password</Label>
						<a
							href='#'
							className='ml-auto text-sm underline-offset-4 hover:underline'
						>
							Forgot your password?
						</a>
					</div>
					<Input id='password' type='password' required />
				</div>
				<Button type='submit' className='w-full'>
					Login
				</Button>
			</div>
			<div className='text-center text-sm'>
				Don&apos;t have an account?{' '}
				<a href='#' className='underline underline-offset-4'>
					Sign up
				</a>
			</div>
		</form>
	);
};

const AlternatePage = () => {
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			<div className='bg-muted relative hidden lg:block'>
				<SomeDescription />
			</div>
			<div className='flex flex-col gap-4 p-6 md:p-10'>
				{/*<div className='flex justify-center gap-2 md:justify-start'>
					<a href='#' className='flex items-center gap-2 font-medium'>
						<Image
							src='/images/habiti-wordmark-black.svg'
							alt='Habiti'
							height={24}
							width={80}
							className='dark:invert'
						/>
					</a>
				</div>*/}
				<div className='flex flex-1 items-center justify-center'>
					<div className='w-full max-w-xs'>
						<LoginForm />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AlternatePage;

export const runtime = 'edge';
