import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItemQuery } from '../types/api';
import { ItemsStackParamList } from '../types/navigation';

const Item: React.FC = () => {
	const { params } = useRoute<RouteProp<ItemsStackParamList, 'Item'>>();
	const { itemId } = params;
	const [{ data, fetching }] = useItemQuery({ variables: { itemId } });

	const item = data?.items_by_pk;

	if (fetching) return <ActivityIndicator />;
	if (!item) throw new Error('This item does not exist');

	return (
		<View style={styles.container}>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Name</Text>
				<Text style={styles.text}>{item.name}</Text>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Description</Text>
				<Text style={styles.text}>{item.description}</Text>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Unit Price</Text>
				<Text style={styles.text}>{item.unit_price} NGN</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	section: {
		padding: 8,
		backgroundColor: '#FFFFFF'
	},
	sectionTitle: {
		marginBottom: 4,
		fontSize: 16,
		color: '#505050',
		fontWeight: '500'
	},
	text: {
		fontSize: 16
	}
});

export default Item;
