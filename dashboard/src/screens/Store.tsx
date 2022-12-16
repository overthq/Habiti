import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useStoreQuery } from '../types/api';
import StoreProfile from '../components/store/StoreProfile';

const Store: React.FC = () => {
	const [{ data, fetching }] = useStoreQuery();
	const store = data?.currentStore;

	if (fetching || !store) {
		return <View />;
	}

	return (
		<View style={styles.container}>
			<StoreProfile store={store} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default Store;
