import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartsContext } from '../contexts/CartsContext';

const Carts = () => {
	const { carts } = React.useContext(CartsContext);

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				keyExtractor={cart => cart.storeId}
				ListHeaderComponent={
					<View style={styles.header}>
						<Text style={styles.title}>Carts</Text>
					</View>
				}
				renderItem={({ item }) => (
					<View key={item.storeId}>
						<Text>{JSON.stringify(item)}</Text>
					</View>
				)}
				data={carts}
				ListEmptyComponent={
					<View>
						<Text>You do not have any active carts.</Text>
					</View>
				}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		// paddingTop: 15,
		// paddingHorizontal: 20,
		flex: 1
	},
	header: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	}
});

export default Carts;
