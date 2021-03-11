import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItemQuery } from '../types/api';
import { ItemsStackParamList } from '../types/navigation';

const Item: React.FC = () => {
	const { params } = useRoute<RouteProp<ItemsStackParamList, 'Item'>>();
	const { itemId } = params;
	const [{ data }] = useItemQuery({ variables: { itemId } });

	const item = data?.items_by_pk;

	if (!item) throw new Error('This item does not exist');

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Text>Name</Text>
				<Text>{item.name}</Text>
			</View>
			<View>
				<Text>Description</Text>
				<Text>{item.description}</Text>
			</View>
			<View>
				<Text>Price per unit</Text>
				<Text>{item.price_per_unit}</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Item;
