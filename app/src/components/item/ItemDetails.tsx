import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ItemDetailsProps {
	item: any;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
	return (
		<View style={styles.container}>
			<View style={styles.meta}>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.price}>${item.unit_price}</Text>
			</View>
			<Text style={styles.header}>Description</Text>
			<Text style={styles.description}>{item?.description}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingTop: 16
	},
	name: {
		fontWeight: 'bold',
		fontSize: 20
	},
	price: {
		fontSize: 18
	},
	meta: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 4,
		borderBottomWidth: 1,
		borderBottomColor: '#D3D3D3'
	},
	header: {
		marginVertical: 8,
		textTransform: 'uppercase',
		color: '#505050',
		fontWeight: '500'
	},
	description: {
		fontSize: 16
	}
});

export default ItemDetails;
