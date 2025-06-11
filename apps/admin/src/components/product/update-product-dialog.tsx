import { useUpdateProductMutation } from '@/data/mutations';
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
import type { Product } from '@/data/types';

interface UpdateProductDialogProps {
	product: Product;
}

const updateProductFormSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	unitPrice: z.string().min(1),
	quantity: z.string().min(1)
});

const UpdateProductDialog = ({ product }: UpdateProductDialogProps) => {
	const updateProductMutation = useUpdateProductMutation(product.id);

	const form = useForm<z.infer<typeof updateProductFormSchema>>({
		resolver: zodResolver(updateProductFormSchema),
		defaultValues: {
			name: product.name,
			description: product.description,
			unitPrice: product.unitPrice.toString(),
			quantity: product.quantity.toString()
		}
	});

	console.log('isValid', form.formState.isValid);

	const onSubmit = (data: z.infer<typeof updateProductFormSchema>) => {
		updateProductMutation.mutate({
			name: data.name,
			description: data.description,
			unitPrice: Number(data.unitPrice),
			quantity: Number(data.quantity)
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Update Product</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Update Product</DialogTitle>
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
												<Input {...field} />
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
												<Textarea {...field} />
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
											<FormLabel>Unit Price</FormLabel>
											<FormControl>
												<Input {...field} />
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
												<Input type='number' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<DialogFooter>
								<Button
									type='submit'
									disabled={!form.formState.isValid || !form.formState.isDirty}
								>
									Save changes
								</Button>
							</DialogFooter>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateProductDialog;
