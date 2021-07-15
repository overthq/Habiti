import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ItemDetailsProps {
	item: any;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
	return (
		<View style={styles.detailsContainer}>
			<View style={styles.metaContainer}>
				<Text style={styles.itemName}>{item.name}</Text>
				<Text style={{ fontSize: 18 }}>${item.unit_price}</Text>
			</View>
			<Text style={styles.descriptionHeader}>Description</Text>
			<Text style={{ fontSize: 16 }}>{item?.description}</Text>
			{/* Related Items */}
		</View>
	);
};

const styles = StyleSheet.create({
	detailsContainer: {
		paddingHorizontal: 20,
		paddingTop: 20
	},
	itemName: {
		fontWeight: 'bold',
		fontSize: 20
	},
	metaContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 4,
		borderBottomWidth: 1,
		borderBottomColor: '#D3D3D3',
		marginBottom: 4
	},
	descriptionHeader: {
		marginVertical: 10,
		textTransform: 'uppercase',
		color: '#505050',
		fontWeight: '500'
	}
});

export default ItemDetails;
