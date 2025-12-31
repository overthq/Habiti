import { useState } from 'react';
import { useCreateProductMutation } from '@/data/mutations';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface CreateProductDialogProps {
	storeId: string;
}

const createProductFormSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	unitPrice: z.string().min(1),
	quantity: z.string().min(1)
});

const CreateProductDialog = ({ storeId }: CreateProductDialogProps) => {
	const [open, setOpen] = useState(false);
	const createProductMutation = useCreateProductMutation(storeId);

	const form = useForm<z.infer<typeof createProductFormSchema>>({
		resolver: zodResolver(createProductFormSchema),
		defaultValues: {
			name: '',
			description: '',
			unitPrice: '',
			quantity: ''
		}
	});

	const onSubmit = (data: z.infer<typeof createProductFormSchema>) => {
		createProductMutation.mutate(
			{
				name: data.name,
				description: data.description,
				unitPrice: Number(data.unitPrice) * 100,
				quantity: Number(data.quantity),
				storeId
			},
			{
				onSuccess: () => {
					setOpen(false);
					form.reset();
				}
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create Product</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Create Product</DialogTitle>
						</DialogHeader>

						<div className='grid gap-4 py-4'>
							<div className='grid gap-2'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder='Product name' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder='Product description'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='unitPrice'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Unit Price (Naira)</FormLabel>
											<FormControl>
												<Input
													type='number'
													placeholder='0'
													min='0'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='quantity'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Quantity</FormLabel>
											<FormControl>
												<Input
													type='number'
													placeholder='0'
													min='0'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<DialogFooter>
								<Button type='submit' disabled={!form.formState.isValid}>
									Create Product
								</Button>
							</DialogFooter>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateProductDialog;
