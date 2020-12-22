import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { useStoreQuery } from '../types/api';
import { MainStackParamList } from '../types/navigation';
import StoreItems from '../components/store/StoreItem';
import StoreHeader from '../components/store/StoreHeader';
import { stores } from '../api';

const Store = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute<RouteProp<MainStackParamList, 'Store'>>();
	// const [{ data, error }] = useStoreQuery({
	// 	variables: { storeId: params.storeId }
	// });
	const store = stores.find(store => store.id === params.storeId);

	if (!store) throw new Error('');

	// if (error) Alert.alert(error.message);

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
