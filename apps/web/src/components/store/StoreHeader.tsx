'use client';

import React from 'react';
import { Store, GetStoreResponse } from '@/data/types';
import FollowButton from './FollowButton';
import { Badge } from '@/components/ui/badge';

interface StoreHeaderProps {
	store: Store;
	viewerContext: GetStoreResponse['viewerContext'];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store, viewerContext }) => {
	return (
		<div className='flex justify-between py-4'>
			<div className='flex items-center gap-4'>
				<div className='rounded-full size-24 overflow-hidden bg-muted flex justify-center items-center'>
					{store.image ? (
						<img src={store.image.path} className='size-full object-cover' />
					) : (
						<p className='text-4xl font-medium text-muted-foreground'>
							{store.name.charAt(0)}
						</p>
					)}
				</div>

				<div className='space-y-1'>
					<div className='flex items-center gap-2'>
						<h1 className='text-2xl font-medium'>{store.name}</h1>
						{store.unlisted && <Badge variant='warning'>Unlisted</Badge>}
					</div>
					<p className='text-muted-foreground'>{store.description}</p>
				</div>
			</div>

			<div className='flex gap-2'>
				<FollowButton
					storeId={store.id}
					isFollowing={viewerContext?.isFollowing}
				/>
			</div>
		</div>
	);
};

export default StoreHeader;
