'use client';

import { Store } from '@/data/types';
import Link from 'next/link';

interface StorePreviewProps {
	store: Store;
}

const StorePreview: React.FC<StorePreviewProps> = ({ store }) => {
	return (
		<Link href={`/store/${store.id}`}>
			<div className='mb-6 rounded-md flex gap-2 items-center'>
				<div className='size-12 rounded-full bg-muted overflow-hidden'>
					{store.image?.path && (
						<img className='size-full' src={store.image?.path} />
					)}
				</div>
				<div className='justify-between items-center'>
					<p className='font-medium'>{store.name}</p>
					<p className='text-xs text-muted-foreground'>Visit store</p>
				</div>
			</div>
		</Link>
	);
};

export default StorePreview;
