import { Screen } from '@habiti/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StoreProducts from '../components/store/StoreProducts';
import { useStoreQuery } from '../types/api';
import { StoreStackParamList } from '../types/navigation';
import ViewCart from '../components/store/ViewCart';

const Store: React.FC = () => {
	const { params } = useRoute<RouteProp<StoreStackParamList, 'Store.Main'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});

	if (fetching || !data?.store) return <ActivityIndicator />;

	return (
		<Screen>
			<SafeAreaView style={{ flex: 1 }}>
				<StoreProducts store={data.store} />
				<ViewCart
					cartId={data.store.userCart?.id}
					count={data.store.userCart?.products.length}
				/>
			</SafeAreaView>
		</Screen>
	);
};

export default Store;
