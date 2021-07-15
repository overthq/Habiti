import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useStoreQuery } from '../types/api';
import { MainStackParamList } from '../types/navigation';
import StoreItems from '../components/store/StoreItems';

const Store = () => {
	const { params } = useRoute<RouteProp<MainStackParamList, 'Store'>>();
	const [{ data }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	const store = data?.stores_by_pk;

	if (!store) throw new Error('How does the store not exist?');

	return (
		<View style={styles.container}>
			<StoreItems store={store} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 10
	}
});

export default Store;
