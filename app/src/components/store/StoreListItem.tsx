import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface StoreListItemProps {
	item: any;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ item }) => {
	const { navigate } = useNavigation();

	return (
		<View style={styles.container}>
			<TouchableOpacity
				key={item.id}
				style={{ flex: 1, margin: 10 }}
				onPress={() => navigate('Item', { itemId: item.id })}
				activeOpacity={0.8}
			>
				<View style={styles.image} />
				<Text style={styles.name}>{item.name}</Text>
				<Text style={{ color: '#505050', fontSize: 15 }}>
					${item.unit_price}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	pressable: {
		flex: 1,
		margin: 10
	},
	image: {
		borderRadius: 6,
		backgroundColor: '#D3D3D3',
		height: 200,
		width: '100%',
		marginBottom: 5
	},
	name: {
		fontSize: 16,
		marginBottom: 2,
		fontWeight: '500'
	}
});

export default StoreListItem;
