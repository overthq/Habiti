import { useState } from 'react';
import { ChevronDown, Pencil, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useUpdateStoreMutation } from '@/data/mutations';
import { type Store } from '@/data/types';
import UpdateStoreDialog from './update-store-dialog';

interface StoreActionsDropdownProps {
	store: Store;
}

const StoreActionsDropdown = ({ store }: StoreActionsDropdownProps) => {
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const updateStoreMutation = useUpdateStoreMutation(store.id);

	const handleToggleListed = () => {
		updateStoreMutation.mutate({ unlisted: !store.unlisted });
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
						Update Store
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<ConfirmDialog
						title={
							store.unlisted ? 'Mark Store as Listed' : 'Mark Store as Unlisted'
						}
						description={
							store.unlisted
								? 'This will make the store visible to customers. The store will appear in search results and the store directory.'
								: 'This will hide the store from customers. The store will no longer appear in search results or the store directory. Are you sure?'
						}
						confirmLabel={
							store.unlisted ? 'Mark as Listed' : 'Mark as Unlisted'
						}
						variant='default'
						isLoading={updateStoreMutation.isPending}
						onConfirm={handleToggleListed}
						trigger={
							<DropdownMenuItem onSelect={e => e.preventDefault()}>
								{store.unlisted ? (
									<Eye className='mr-2 h-4 w-4' />
								) : (
									<EyeOff className='mr-2 h-4 w-4' />
								)}
								{store.unlisted ? 'Mark as Listed' : 'Mark as Unlisted'}
							</DropdownMenuItem>
						}
					/>
				</DropdownMenuContent>
			</DropdownMenu>

			<UpdateStoreDialog
				store={store}
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
			/>
		</>
	);
};

export default StoreActionsDropdown;
