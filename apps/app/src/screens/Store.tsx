import { Icon, Screen } from '@market/components';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, ActivityIndicator, Pressable } from 'react-native';

import StoreProducts from '../components/store/StoreProducts';
import useGoBack from '../hooks/useGoBack';
import { useStoreQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Store: React.FC = () => {
	const { navigate, setOptions } = useNavigation();
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
					<Icon name='search' />
				</Pressable>
			)
		});
	}, []);

	if (fetching || !data?.store) return <ActivityIndicator />;

	return (
		<Screen style={styles.container}>
			<StoreProducts store={data.store} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8
	},
	back: {
		paddingLeft: 8
	}
});

export default Store;
