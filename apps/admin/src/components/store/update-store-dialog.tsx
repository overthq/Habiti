import { useUpdateStoreMutation } from '@/data/mutations';
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
import { type Store } from '@/data/types';

interface UpdateStoreDialogProps {
	store: Store;
}

const updateStoreFormSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1)
});

const UpdateStoreDialog = ({ store }: UpdateStoreDialogProps) => {
	const form = useForm<z.infer<typeof updateStoreFormSchema>>({
		resolver: zodResolver(updateStoreFormSchema),
		defaultValues: {
			name: store.name,
			description: store.description
		}
	});
	const updateStoreMutation = useUpdateStoreMutation(store.id);

	const onSubmit = (data: z.infer<typeof updateStoreFormSchema>) => {
		updateStoreMutation.mutate({
			name: data.name,
			description: data.description
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Dialog>
					<DialogTrigger asChild>
						<Button>Update Store</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Update Store</DialogTitle>
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
												<Textarea id='description' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type='submit'>Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</form>
		</Form>
	);
};

export default UpdateStoreDialog;
