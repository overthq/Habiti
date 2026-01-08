'use client';

import SignInPrompt from '@/components/SignInPrompt';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	useDeleteCurrentUserMutation,
	useUpdateCurrentUserMutation
} from '@/data/mutations';
import { useCardsQuery, useCurrentUserQuery } from '@/data/queries';
import { User } from '@/data/types';
import { useAuthStore } from '@/state/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const profileFormSchema = z.object({
	name: z.string(),
	email: z.string().email()
});

interface AccountTabProps {
	user: User;
}

const AccountTab: React.FC<AccountTabProps> = ({ user }) => {
	const updateCurrentUserMutation = useUpdateCurrentUserMutation();
	const deleteCurrentUserMutation = useDeleteCurrentUserMutation();

	const form = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name: user.name,
			email: user.email
		}
	});

	const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
		updateCurrentUserMutation.mutate(data);
	};

	const handleDeleteAccount = () => {
		deleteCurrentUserMutation.mutate();
	};

	return (
		<div>
			<h2 className='font-medium my-4'>Your Profile</h2>

			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Controller
					name='name'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Name</FieldLabel>
							<Input
								{...field}
								aria-invalid={fieldState.invalid}
								autoComplete='off'
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Button type='submit' className='mt-4'>
					Save
				</Button>
			</form>

			<Separator className='my-4' />

			<div className='space-y-2'>
				<h2 className='font-medium'>Delete Account</h2>

				<p className='text-sm text-muted-foreground mb-3'>
					Deleting your account will also delete any data associated, including
					orders and carts.
				</p>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant='destructive'>Delete account</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Account</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete your account? This action cannot
								be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleDeleteAccount}>
								Confirm
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
};

const PaymentsTab = () => {
	const { isLoading, data } = useCardsQuery();

	if (isLoading || !data) {
		return <div />; // TODO: Skeleton
	}

	return (
		<div>
			<div>
				<h2 className='font-medium mt-4 mb-1'>Payment Methods</h2>

				<p className='text-sm text-muted-foreground mb-4'>
					Your payment methods are stored securely by Paystack.
				</p>

				{data.cards.map(card => (
					<div key={card.id}>
						<p className='capitalize'>
							{card.cardType} {`\u2022\u2022\u2022\u2022${card.last4}`}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

const SettingsPage = () => {
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
		<div>
			<h1 className='text-2xl font-medium mb-4'>Settings</h1>

			<div className='w-full'>
				<Tabs defaultValue='account'>
					<TabsList>
						<TabsTrigger value='account'>Account</TabsTrigger>
						<TabsTrigger value='payments'>Payments</TabsTrigger>
					</TabsList>
					<TabsContent value='account'>
						<AccountTab user={data.user} />
					</TabsContent>
					<TabsContent value='payments'>
						<PaymentsTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default SettingsPage;

export const runtime = 'edge';
