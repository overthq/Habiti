import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useStoreQuery } from '../types/api';
import { MainStackParamList } from '../types/navigation';
import StoreItems from '../components/store/StoreItems';

const Store = () => {
	const { params } = useRoute<RouteProp<MainStackParamList, 'Store'>>();
	const [{ data, error }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	const store = data?.stores_by_pk;

	React.useEffect(() => {
		console.log({ data, error });
	}, [data, error]);

	if (!store) return <View />;

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
