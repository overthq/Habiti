import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { CartsContext } from '../contexts/CartsContext';

const Carts = () => {
	const { carts } = React.useContext(CartsContext);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Carts</Text>
			<FlatList
				keyExtractor={cart => cart.storeId}
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
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 15,
		paddingHorizontal: 20,
		flex: 1
	},
	// header: {
	// 	paddingVertical: 15,
	// 	paddingHorizontal: 20,
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-between'
	// },
	title: {
		fontWeight: 'bold',
		fontSize: 32
	}
});

export default Carts;
