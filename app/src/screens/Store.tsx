import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useStoreQuery } from '../types/api';
import { MainStackParamList } from '../types/navigation';
import StoreItems from '../components/store/StoreItem';
import StoreHeader from '../components/store/StoreHeader';

const Store = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute<RouteProp<MainStackParamList, 'Store'>>();
	const [{ data }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	const store = data?.stores.find(store => store.id === params.storeId);

	if (!store) throw new Error('');

	React.useLayoutEffect(() => {
		setOptions({ title: store.name });
	}, []);

	return (
		<View style={styles.container}>
			<StoreItems
				storeId={store.id}
				header={() => <StoreHeader store={store} />}
			/>
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
