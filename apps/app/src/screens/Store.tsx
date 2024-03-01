import { Screen } from '@market/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

import StoreProducts from '../components/store/StoreProducts';
import useGoBack from '../hooks/useGoBack';
import { useStoreQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Store: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Store'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	useGoBack();

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
