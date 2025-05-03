import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { type User } from '@/data/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUserMutation } from '@/data/mutations';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

interface UpdateUserDialogProps {
	user: User;
}

const updateUserFormSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	suspended: z.boolean()
});

const UpdateUserDialog = ({ user }: UpdateUserDialogProps) => {
	const updateUserMutation = useUpdateUserMutation(user.id);

	const form = useForm<z.infer<typeof updateUserFormSchema>>({
		resolver: zodResolver(updateUserFormSchema),
		defaultValues: {
			name: user.name,
			email: user.email,
			suspended: user.suspended
		}
	});

	const onSubmit = (data: z.infer<typeof updateUserFormSchema>) => {
		updateUserMutation.mutate(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Dialog>
					<DialogTrigger asChild>
						<Button>Update User</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Update User</DialogTitle>
							<DialogDescription>
								Update the user's details below.
							</DialogDescription>
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
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='suspended'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Suspended</FormLabel>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type='submit' disabled={updateUserMutation.isPending}>
								{updateUserMutation.isPending ? 'Updating...' : 'Update User'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</form>
		</Form>
	);
};

export default UpdateUserDialog;
