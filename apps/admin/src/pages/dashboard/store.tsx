import React from 'react';
import { useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateStoreMutation } from '@/data/mutations';
import { useStoreQuery } from '@/data/queries';
import { UpdateStoreBody } from '@/data/types';

const Store = () => {
	const { id } = useParams();
	const { data: storeData, isLoading } = useStoreQuery(id as string);
	const { mutateAsync: updateStore } = useUpdateStoreMutation(id as string);
	const [formData, setFormData] = React.useState<UpdateStoreBody>({});

	if (isLoading || !id) {
		return <div>Loading...</div>;
	}

	const store = storeData?.store;

	if (!store) {
		return <div>Store not found</div>;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateStore(formData);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>{store.name}</h1>
				<Button onClick={handleSubmit} disabled={!Object.keys(formData).length}>
					Save Changes
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Store Details</CardTitle>
					</CardHeader>
					<CardContent>
						<form className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									name='name'
									defaultValue={store.name}
									onChange={handleChange}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									name='description'
									defaultValue={store.description}
									onChange={handleChange}
								/>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Store Information</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className='space-y-4'>
							<div>
								<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Created
								</dt>
								<dd className='mt-1'>
									{new Date(store.createdAt).toLocaleDateString()}
								</dd>
							</div>
							<div>
								<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Last Updated
								</dt>
								<dd className='mt-1'>
									{new Date(store.updatedAt).toLocaleDateString()}
								</dd>
							</div>
							{store.image && (
								<div>
									<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
										Store Image
									</dt>
									<dd className='mt-1'>
										<img
											src={store.image.path}
											alt={store.name}
											className='rounded-md w-full max-w-xs'
										/>
									</dd>
								</div>
							)}
						</dl>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Store;
