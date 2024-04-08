import { Icon, Screen } from '@market/components';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';

import StoreProducts from '../components/store/StoreProducts';
import useGoBack from '../hooks/useGoBack';
import { useStoreQuery } from '../types/api';
import { StoreStackParamList } from '../types/navigation';

const Store: React.FC = () => {
	const { navigate, setOptions } =
		useNavigation<NavigationProp<StoreStackParamList>>();
	const { params } = useRoute<RouteProp<StoreStackParamList, 'Store.Main'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	useGoBack();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable
					style={{ marginRight: 16 }}
					onPress={() => navigate('Store.Search', { storeId: params.storeId })}
				>
					<Icon name='search' size={22} />
				</Pressable>
			)
		});
	}, []);

	if (fetching || !data?.store) return <ActivityIndicator />;

	return (
		<Screen>
			<StoreProducts store={data.store} />
		</Screen>
	);
};

export default Store;
