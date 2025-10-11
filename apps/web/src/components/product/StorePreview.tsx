'use client';

import { Store } from '@/data/types';
import Link from 'next/link';

interface StorePreviewProps {
	store: Store;
}

const StorePreview: React.FC<StorePreviewProps> = ({ store }) => {
	return (
		<Link href={`/store/${store.id}`}>
			<div className='mb-6 rounded-md flex gap-2'>
				<div className='size-10 rounded-full bg-muted overflow-hidden'>
					{store.image?.path && (
						<img className='size-full' src={store.image?.path} />
					)}
				</div>
				<div className='flex justify-between items-center'>
					<p className='font-medium'>{store.name}</p>
				</div>
			</div>
		</Link>
	);
};

export default StorePreview;
