'use client';

import Link from 'next/link';
import { LockIcon } from 'lucide-react';

import { Button } from './ui/button';

interface SignInPromptProps {
	title: string;
	description: string;
	primaryCtaLabel?: string;
}

const SignInPrompt: React.FC<SignInPromptProps> = ({
	title,
	description,
	primaryCtaLabel = 'Sign in'
}) => {
	return (
		<div className='flex flex-col items-center justify-center gap-4 text-center min-h-[60vh] px-4'>
			<div className='size-14 rounded-full bg-muted flex items-center justify-center text-primary'>
				<LockIcon className='size-6' />
			</div>
			<div className='max-w-md space-y-2'>
				<h2 className='text-2xl font-semibold'>{title}</h2>
				<p className='text-muted-foreground'>{description}</p>
			</div>
			<div className='flex flex-wrap gap-3 justify-center'>
				<Button asChild>
					<Link href='/login'>{primaryCtaLabel}</Link>
				</Button>
				<Button variant='outline' asChild>
					<Link href='/register'>Create account</Link>
				</Button>
			</div>
		</div>
	);
};

export default SignInPrompt;
