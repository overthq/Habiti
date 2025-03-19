import { gql, useMutation } from 'urql';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';

interface StorePreviewProps {
	store: any;
	followed: boolean;
}

const StorePreview: React.FC<StorePreviewProps> = ({ store, followed }) => {
	const [, followStore] = useMutation(FOLLOW_STORE);
	const [, unfollowStore] = useMutation(UNFOLLOW_STORE);

	// FIXME: Maybe convert this to toggleFollow on the backend
	// But maybe that is not idiomatic enough and allows for race conditions?
	const handleSubmit = async () => {
		if (followed) {
			await unfollowStore({ storeId: store.id });
		} else {
			await followStore({ storeId: store.id });
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
							<Check /> Following
						</>
					) : (
						<>
							<Plus /> Follow
						</>
					)}
				</Button>
			</div>
		</div>
	);
};

const FOLLOW_STORE = gql`
	mutation FollowStore($storeId: ID!) {
		followStore(storeId: $storeId) {
			storeId
			followerId
		}
	}
`;

const UNFOLLOW_STORE = gql`
	mutation UnfollowStore($storeId: ID!) {
		unfollowStore(storeId: $storeId) {
			storeId
			followerId
		}
	}
`;

export default StorePreview;
