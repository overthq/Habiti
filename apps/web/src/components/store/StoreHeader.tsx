import React from 'react';
import { MessageCircleIcon } from 'lucide-react';
import type { Store, GetStoreResponse } from '@/data/types';
import FollowButton from './FollowButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
		<div className='w-full md:grow md:mx-auto flex flex-col justify-center space-y-4 mb-8'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<StoreAvatar store={store} />

					<div className='flex items-center gap-2'>
						<h1 className='text-xl font-medium truncate'>{store.name}</h1>
						{store.unlisted && <Badge variant='secondary'>Unlisted</Badge>}
					</div>
				</div>

				<div className='flex items-center gap-2'>
					{store.whatsapp && (
						<Button variant='outline' asChild>
							<a
								href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
									`Hi ${store.name}, I found your store on Habiti.`
								)}`}
								target='_blank'
								rel='noreferrer noopener'
							>
								<MessageCircleIcon />
								WhatsApp
							</a>
						</Button>
					)}
					<FollowButton
						storeId={store.id}
						isFollowing={viewerContext?.isFollowing}
					/>
				</div>
			</div>
		</div>
	);
};

export default StoreHeader;
