import { useState } from 'react';
import { ChevronDown, Pencil, Copy, UserX, UserCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useUpdateUserMutation } from '@/data/mutations';
import { type User } from '@/data/types';
import UpdateUserDialog from './update-user-dialog';

interface UserActionsDropdownProps {
	user: User;
}

const UserActionsDropdown = ({ user }: UserActionsDropdownProps) => {
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const updateUserMutation = useUpdateUserMutation(user.id);

	const handleToggleSuspended = () => {
		updateUserMutation.mutate({ suspended: !user.suspended });
	};

	const handleCopyId = () => {
		navigator.clipboard.writeText(user.id);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='outline'>
						Actions
						<ChevronDown className='ml-2 h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem onSelect={() => setUpdateDialogOpen(true)}>
						<Pencil className='mr-2 h-4 w-4' />
						Update User
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={handleCopyId}>
						<Copy className='mr-2 h-4 w-4' />
						Copy User ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<ConfirmDialog
						title={user.suspended ? 'Unsuspend User' : 'Suspend User'}
						description={
							user.suspended
								? "This will restore the user's access to the platform. They will be able to log in and use the app again."
								: 'This will prevent the user from accessing the platform. They will not be able to log in or use the app until unsuspended.'
						}
						confirmLabel={user.suspended ? 'Unsuspend' : 'Suspend'}
						variant={user.suspended ? 'default' : 'destructive'}
						isLoading={updateUserMutation.isPending}
						onConfirm={handleToggleSuspended}
						trigger={
							<DropdownMenuItem onSelect={e => e.preventDefault()}>
								{user.suspended ? (
									<UserCheck className='mr-2 h-4 w-4' />
								) : (
									<UserX className='mr-2 h-4 w-4' />
								)}
								{user.suspended ? 'Unsuspend User' : 'Suspend User'}
							</DropdownMenuItem>
						}
					/>
				</DropdownMenuContent>
			</DropdownMenu>

			<UpdateUserDialog
				user={user}
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
			/>
		</>
	);
};

export default UserActionsDropdown;
