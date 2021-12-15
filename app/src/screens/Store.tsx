import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useStoreQuery } from '../types/api';
import { MainStackParamList } from '../types/navigation';
import StoreProducts from '../components/store/StoreProducts';

const Store: React.FC = () => {
	const { params } = useRoute<RouteProp<MainStackParamList, 'Store'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});

	if (fetching) return <ActivityIndicator />;

	const store = data?.store;
	if (!store) return <View />;

	return (
		<SafeAreaView style={styles.container}>
			<StoreProducts store={store} />
		</SafeAreaView>
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
