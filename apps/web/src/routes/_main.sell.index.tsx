import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { CheckCircle2Icon, StoreIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateStoreMutation } from '@/data/mutations';
import type { CreateStoreBody, Store } from '@/data/types';
import { useAuthStore } from '@/state/auth-store';

export const Route = createFileRoute('/_main/sell/')({
	component: SellPage
});

interface CreateStoreFormValues {
	name: string;
	description: string;
	website: string;
	twitter: string;
	instagram: string;
}

const trimOptional = (value: string) => {
	const trimmed = value.trim();
	return trimmed.length === 0 ? undefined : trimmed;
};

const CreateStoreForm: React.FC<{ onSuccess: (store: Store) => void }> = ({
	onSuccess
}) => {
	const form = useForm<CreateStoreFormValues>({
		defaultValues: {
			name: '',
			description: '',
			website: '',
			twitter: '',
			instagram: ''
		}
	});

	const createStoreMutation = useCreateStoreMutation({ onSuccess });

	const onSubmit = (values: CreateStoreFormValues) => {
		const body: CreateStoreBody = {
			name: values.name.trim(),
			description: values.description.trim(),
			website: trimOptional(values.website),
			twitter: trimOptional(values.twitter),
			instagram: trimOptional(values.instagram)
		};

		createStoreMutation.mutate(body);
	};

	return (
		<form
			className='grid items-start gap-4'
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<Controller
				name='name'
				control={form.control}
				rules={{ required: 'Store name is required' }}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Store name</FieldLabel>
						<Input
							{...field}
							id={field.name}
							aria-invalid={fieldState.invalid}
							placeholder='Nike'
							autoComplete='off'
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				name='description'
				control={form.control}
				rules={{ required: 'Store description is required' }}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Store description</FieldLabel>
						<Textarea
							{...field}
							id={field.name}
							aria-invalid={fieldState.invalid}
							placeholder='Brief description of your store'
							rows={4}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				name='website'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Website (optional)</FieldLabel>
						<Input
							{...field}
							id={field.name}
							inputMode='url'
							placeholder='https://example.com'
							autoComplete='url'
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				name='twitter'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Twitter (optional)</FieldLabel>
						<Input
							{...field}
							id={field.name}
							placeholder='@yourstore'
							autoComplete='off'
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				name='instagram'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Instagram (optional)</FieldLabel>
						<Input
							{...field}
							id={field.name}
							placeholder='@yourstore'
							autoComplete='off'
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Button
				type='submit'
				className='w-full mt-2'
				disabled={createStoreMutation.isPending}
			>
				{createStoreMutation.isPending ? 'Creating store…' : 'Create store'}
			</Button>
		</form>
	);
};

const UnauthenticatedView = () => {
	const { toggleAuthModal } = useAuthStore();

	return (
		<div className='flex flex-col items-center justify-center gap-4 text-center min-h-[60vh] px-4'>
			<div className='size-14 rounded-full bg-muted flex items-center justify-center text-primary'>
				<StoreIcon className='size-6' />
			</div>
			<div className='max-w-md space-y-2'>
				<h2 className='text-2xl font-semibold'>Sell on Habiti</h2>
				<p className='text-muted-foreground'>
					Log in or create an account to set up your store. Once your store is
					live, manage products and orders from the Habiti Dashboard mobile app.
				</p>
			</div>
			<div className='flex flex-wrap gap-3 justify-center'>
				<Button onClick={toggleAuthModal}>Sign in</Button>
				<Button variant='outline' onClick={toggleAuthModal}>
					Create account
				</Button>
			</div>
		</div>
	);
};

interface SuccessViewProps {
	store: Store;
	onCreateAnother: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({
	store,
	onCreateAnother
}) => {
	return (
		<div className='max-w-xl mx-auto flex flex-col items-center text-center gap-4 py-8'>
			<div className='size-14 rounded-full bg-muted flex items-center justify-center text-primary'>
				<CheckCircle2Icon className='size-6' />
			</div>
			<div className='space-y-2'>
				<h2 className='text-2xl font-semibold'>{store.name} is live</h2>
				<p className='text-muted-foreground'>
					Your store has been created. Download the Habiti Dashboard app to add
					products, manage orders, and configure payouts.
				</p>
			</div>
			<div className='flex flex-wrap gap-3 justify-center'>
				<Button asChild>
					<a
						href='https://apps.apple.com/app/habiti-dashboard/id0'
						target='_blank'
						rel='noreferrer noopener'
					>
						Download for iOS
					</a>
				</Button>
				<Button variant='outline' asChild>
					<a
						href='https://play.google.com/store/apps/details?id=com.habiti.dashboard'
						target='_blank'
						rel='noreferrer noopener'
					>
						Download for Android
					</a>
				</Button>
			</div>
			<Button
				variant='link'
				className='text-muted-foreground'
				onClick={onCreateAnother}
			>
				Create another store
			</Button>
		</div>
	);
};

function SellPage() {
	const { accessToken } = useAuthStore();
	const isAuthenticated = Boolean(accessToken);
	const [createdStore, setCreatedStore] = React.useState<Store | null>(null);

	if (!isAuthenticated) {
		return <UnauthenticatedView />;
	}

	if (createdStore) {
		return (
			<SuccessView
				store={createdStore}
				onCreateAnother={() => setCreatedStore(null)}
			/>
		);
	}

	return (
		<div className='max-w-xl mx-auto'>
			<div className='mb-6 space-y-1'>
				<h1 className='text-2xl font-semibold'>Create your store</h1>
				<p className='text-muted-foreground text-sm'>
					Set up the basics now — you can add products, images, and payout
					details later from the Habiti Dashboard mobile app.
				</p>
			</div>

			<CreateStoreForm onSuccess={setCreatedStore} />
		</div>
	);
}
