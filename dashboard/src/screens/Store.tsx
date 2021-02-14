import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/store';
import { useStoreQuery } from '../types/api';

/*
 * This screen enables users to update metadata about their store, and manage high-level information,
 * such as payout frequencies, subscription tiers and even store name, short name and avatar.
 */

const Store: React.FC = () => {
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);
	const [{ data }] = useStoreQuery({ variables: { storeId: activeStore } });

	const store = data?.stores[0];

	return (
		<View style={styles.container}>
			<TouchableOpacity>
				{/* Add store image here */}
				<Text>{store?.name}</Text>
				{/* <Text>@{store?.short_name}</Text> */}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Store;
