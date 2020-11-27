import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useStoreQuery } from '../types/api';
import { MainStackParamList } from '../types/navigation';
import StoreItems from '../components/store/StoreItem';
import StoreHeader from '../components/store/StoreHeader';

const Store = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute<RouteProp<MainStackParamList, 'Store'>>();
	const [{ data, error }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});

	if (error) Alert.alert(error.message);

	React.useLayoutEffect(() => {
		setOptions({ title: data?.stores[0].name });
	}, [data]);

	return (
		<View style={styles.container}>
			<StoreItems
				storeId={data?.stores[0].id}
				header={() => <StoreHeader store={data?.stores[0]} />}
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
