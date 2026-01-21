import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface BulkActionsToolbarProps {
	selectedCount: number;
	onClearSelection: () => void;
	children: React.ReactNode;
}

export const BulkActionsToolbar = ({
	selectedCount,
	onClearSelection,
	children
}: BulkActionsToolbarProps) => {
	if (selectedCount === 0) {
		return null;
	}

	return (
		<div className='absolute w-full bottom-2'>
			<div className='flex gap-4 px-3 py-2 bg-muted/50 border rounded-md w-fit mx-auto'>
				<div className='flex items-center gap-2'>
					<span className='text-sm font-medium'>
						{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
					</span>
					<Button
						variant='ghost'
						size='sm'
						onClick={onClearSelection}
						className='h-7 px-2'
					>
						<X className='h-4 w-4' />
						<span className='sr-only'>Clear selection</span>
					</Button>
				</div>
				<div className='flex items-center gap-2'>{children}</div>
			</div>
		</div>
	);
};
