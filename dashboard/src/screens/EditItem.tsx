import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const EditItem: React.FC = () => {
	const { params } = useRoute<any>();

	const { itemId } = params;
	// On load, fetch the item from the database, and use the returned data to pre-fill fields.

	const editItem = () => {
		console.log(itemId);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={editItem}>
				<Text>Update Item</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default EditItem;
