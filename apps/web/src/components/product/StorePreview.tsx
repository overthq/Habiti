'use client';

import { Store } from '@/data/types';

interface StorePreviewProps {
	store: Store;
}

const StorePreview: React.FC<StorePreviewProps> = ({ store }) => {
	return (
		<div className='mb-6 border rounded-md p-4'>
			<div>
				<img src={store.image?.path} />
			</div>
			<div className='flex justify-between items-center'>
				<p>{store.name}</p>
			</div>
		</div>
	);
};

export default StorePreview;
