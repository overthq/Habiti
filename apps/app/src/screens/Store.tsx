import { Icon, Screen } from '@market/components';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';

import StoreHeader from '../components/store/StoreHeader';
import StoreProducts from '../components/store/StoreProducts';
import useGoBack from '../hooks/useGoBack';
import { useStoreQuery } from '../types/api';
import { AppStackParamList, ExploreStackParamList } from '../types/navigation';

const Store: React.FC = () => {
	const { navigate, setOptions } =
		useNavigation<NavigationProp<ExploreStackParamList>>();
	const { params } = useRoute<RouteProp<AppStackParamList, 'Store'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	useGoBack();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable
					style={{ marginRight: 16 }}
					onPress={() => navigate('SearchStore', { storeId: params.storeId })}
				>
					<Icon name='search' size={22} />
				</Pressable>
			)
		});
	}, []);

	if (fetching || !data?.store) return <ActivityIndicator />;

	return (
		<Screen>
			{/* <StoreHeader store={data.store} /> */}
			<StoreProducts store={data.store} />
		</Screen>
	);
};

export default Store;