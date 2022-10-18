import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useStoreQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import StoreProducts from '../components/store/StoreProducts';
import useGoBack from '../hooks/useGoBack';

const Store: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Store'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	useGoBack();

	if (fetching || !data?.store) return <ActivityIndicator />;

	return (
		<View style={styles.container}>
			<StoreProducts store={data.store} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 8
	},
	back: {
		paddingLeft: 8
	}
});

export default Store;
