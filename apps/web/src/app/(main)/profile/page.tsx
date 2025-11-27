'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

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

import {
	ItemActions,
	ItemDescription,
	ItemContent,
	ItemTitle,
	Item
} from '@/components/ui/item';
import PaymentMethods from '@/components/profile/PaymentMethods';
import { Separator } from '@/components/ui/separator';
import { useUpdateCurrentUserMutation } from '@/data/mutations';
import SignInPrompt from '@/components/SignInPrompt';
import { useAuthStore } from '@/state/auth-store';

const profileFormSchema = z.object({
	name: z.string(),
	email: z.string().email()
});

interface ProfileFormProps {
	name: string;
	email: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ name, email }) => {
	const updateCurrentUserMutation = useUpdateCurrentUserMutation();

	const form = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name,
			email
		}
	});

	const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
		updateCurrentUserMutation.mutate(data);
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
					disabled
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
	const { accessToken } = useAuthStore();
	const isAuthenticated = Boolean(accessToken);
	const { data, isLoading } = useCurrentUserQuery({
		enabled: isAuthenticated
	});

	if (!isAuthenticated) {
		return (
			<SignInPrompt
				title='Sign in to manage your profile'
				description='Update your details, manage payment methods, and keep your preferences in sync by signing in to your Habiti account.'
			/>
		);
	}

	if (isLoading || !data) {
		return <div />;
	}

	return (
		<div className='space-y-4'>
			<h1 className='text-3xl font-medium mb-4'>Profile</h1>

			<ProfileForm name={data.user.name} email={data.user.email} />

			<Separator />

			<PaymentMethods />

			<Separator />

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
