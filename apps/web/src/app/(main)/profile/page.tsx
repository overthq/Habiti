'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

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

import { useCurrentUserQuery } from '@/data/queries';

import { useAuthStore } from '@/state/auth-store';
import {
	ItemActions,
	ItemDescription,
	ItemContent,
	ItemTitle,
	Item
} from '@/components/ui/item';

const profileFormSchema = z.object({
	name: z.string(),
	email: z.string().email()
});

interface ProfileFormProps {
	name: string;
	email: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ name, email }) => {
	const form = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name,
			email
		}
	});

	const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
		console.log(data);
	};

	return (
		<Form {...form}>
			<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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

				<Button type='submit'>Save</Button>
			</form>
		</Form>
	);
};

const ProfilePage = () => {
	const { data, isLoading } = useCurrentUserQuery();

	if (isLoading || !data) {
		return <div />;
	}

	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-medium mb-4'>Profile</h1>

			<div className='bg-secondary rounded-md p-4 mb-4 space-y-2'>
				<p className='text-xl font-medium'>{data.user.name}</p>
				<p className='text-sm text-muted-foreground'>{data.user.email}</p>
			</div>

			<ProfileForm name={data.user.name} email={data.user.email} />

			<Item variant='outline'>
				<ItemContent>
					<ItemTitle>Delete Account</ItemTitle>
					<ItemDescription>
						Delete your account and all your data.
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant='destructive' size='sm'>
						Delete
					</Button>
				</ItemActions>
			</Item>
		</div>
	);
};

export const runtime = 'edge';

export default ProfilePage;
