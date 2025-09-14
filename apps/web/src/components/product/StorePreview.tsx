'use client';

import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation
} from '@/data/mutations';
import { Store } from '@/data/types';

interface StorePreviewProps {
	store: Store;
	followed: boolean;
}

const StorePreview: React.FC<StorePreviewProps> = ({ store, followed }) => {
	const followStoreMutation = useFollowStoreMutation();
	const unfollowStoreMutation = useUnfollowStoreMutation();

	const handleSubmit = async () => {
		if (followed) {
			await unfollowStoreMutation.mutateAsync(store.id);
		} else {
			await followStoreMutation.mutateAsync(store.id);
		}
	};

	return (
		<div className='mt-6 border rounded-md p-4'>
			<div>
				<img src={store.image?.path} />
			</div>
			<div className='flex justify-between items-center'>
				<p>{store.name}</p>
				<Button onClick={handleSubmit}>
					{followed ? (
						<>
							<Check size={20} className='mr-1' /> Following
						</>
					) : (
						<>
							<Plus size={20} className='mr-2' /> Follow
						</>
					)}
				</Button>
			</div>
		</div>
	);
};

export default StorePreview;
