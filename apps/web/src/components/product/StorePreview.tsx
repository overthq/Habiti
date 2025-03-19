import { Button } from '@/components/ui/button';

interface StorePreviewProps {
	store: any;
}

const StorePreview: React.FC<StorePreviewProps> = ({ store }) => {
	return (
		<div className='mt-6 border rounded-md p-4'>
			<div>
				<img src={store.image?.path} />
			</div>
			<div className='flex justify-between items-center'>
				<p>{store.name}</p>
				<Button>Follow</Button>
			</div>
		</div>
	);
};

export default StorePreview;
