import { useState } from 'react';
import { useCreateStoreMutation } from '@/data/mutations';
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

const createStoreFormSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional()
});

const CreateStoreDialog = () => {
	const [open, setOpen] = useState(false);
	const createStoreMutation = useCreateStoreMutation();

	const form = useForm<z.infer<typeof createStoreFormSchema>>({
		resolver: zodResolver(createStoreFormSchema),
		defaultValues: {
			name: '',
			description: ''
		}
	});

	const onSubmit = (data: z.infer<typeof createStoreFormSchema>) => {
		createStoreMutation.mutate(
			{
				name: data.name,
				description: data.description || undefined
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
				<Button>Create Store</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Create Store</DialogTitle>
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
												<Input placeholder='Store name' {...field} />
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
													placeholder='Store description (optional)'
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
									Create Store
								</Button>
							</DialogFooter>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateStoreDialog;
