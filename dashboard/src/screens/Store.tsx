import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '../redux/store';
import { useStoreQuery } from '../types/api';

const Store: React.FC = () => {
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);
	const [{ data }] = useStoreQuery({ variables: { storeId: activeStore } });

	const store = data?.stores[0];

	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity>
				{/* Add store image here */}
				<Text>{store?.name}</Text>
				{/* <Text>@{store?.short_name}</Text> */}
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Store;
