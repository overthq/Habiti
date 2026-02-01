'use client';

import React from 'react';
import { Store, GetStoreResponse } from '@/data/types';
import FollowButton from './FollowButton';
import { Badge } from '@/components/ui/badge';

interface StoreHeaderProps {
	store: Store;
	viewerContext: GetStoreResponse['viewerContext'];
}

const StoreAvatar = ({ store }: { store: Store }) => {
	return (
		<div className='rounded-full size-16 overflow-hidden bg-muted flex justify-center items-center'>
			{store.image ? (
				<img src={store.image.path} className='size-full object-cover' />
			) : (
				<p className='text-2xl font-medium text-muted-foreground'>
					{store.name.charAt(0)}
				</p>
			)}
		</div>
	);
};

const StoreHeader: React.FC<StoreHeaderProps> = ({ store, viewerContext }) => {
	return (
		<div className='w-full md:grow-1 md:max-w-3xl md:mx-auto flex flex-col justify-center space-y-4 mb-8'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<StoreAvatar store={store} />

					<div className='flex items-center gap-2'>
						<h1 className='text-xl font-medium truncate'>{store.name}</h1>
						{store.unlisted && <Badge variant='warning'>Unlisted</Badge>}
					</div>
				</div>

				<FollowButton
					storeId={store.id}
					isFollowing={viewerContext?.isFollowing}
				/>
			</div>
		</div>
	);
};

export default StoreHeader;
