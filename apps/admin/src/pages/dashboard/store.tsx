import { useStoreQuery } from '@/data/queries';
import { useParams } from 'react-router';

const Store = () => {
	const { id } = useParams();

	const { data: storeData, isLoading } = useStoreQuery(id as string);

	if (isLoading || !id) {
		return <div>Loading...</div>;
	}

	const store = storeData?.store;

	return (
		<div>
			<h1>{store?.name}</h1>
		</div>
	);
};

export default Store;
