'use client';

import React from 'react';
import { Save } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProductMutation } from '@/data/mutations/products';
import { useProductQuery } from '@/data/queries/products';
import { UpdateProductBody } from '@/data/services/products';

export default function ProductDetailPage({
	params
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);
	const { data: productData, isLoading } = useProductQuery(id);
	const { mutateAsync: updateProduct } = useUpdateProductMutation(id);
	const [formData, setFormData] = React.useState<UpdateProductBody>({});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const product = productData?.product;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateProduct(formData);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]:
				name === 'unitPrice' || name === 'quantity' ? Number(value) : value
		}));
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>{product?.name}</h1>
				<Button onClick={handleSubmit} disabled={!Object.keys(formData).length}>
					<Save className='h-4 w-4 mr-2' />
					Save Changes
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Product Details</CardTitle>
					</CardHeader>
					<CardContent>
						<form className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									name='name'
									defaultValue={product?.name}
									onChange={handleChange}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									name='description'
									defaultValue={product?.description}
									onChange={handleChange}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='unitPrice'>Unit Price</Label>
								<Input
									id='unitPrice'
									name='unitPrice'
									type='number'
									step='0.01'
									defaultValue={product?.unitPrice}
									onChange={handleChange}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='quantity'>Stock Quantity</Label>
								<Input
									id='quantity'
									name='quantity'
									type='number'
									defaultValue={product?.quantity}
									onChange={handleChange}
								/>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Product Images</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 gap-4'>
							{product?.images.map(image => (
								<div
									key={image.id}
									className='relative aspect-square rounded-lg overflow-hidden'
								>
									<Image
										src={image.path}
										alt={product.name}
										fill
										className='object-cover'
									/>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
