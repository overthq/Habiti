import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../types/navigation';

interface StoreListItemProps {
	item: any;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ item }) => {
	const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

	return (
		<View style={styles.container}>
			<TouchableOpacity
				key={item.id}
				style={styles.pressable}
				onPress={() => navigate('Item', { itemId: item.id })}
				activeOpacity={0.8}
			>
				<View style={styles.image} />
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.price}>${item.unit_price}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1 / 2
	},
	pressable: {
		flex: 1,
		margin: 8
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
	},
	price: {
		color: '#505050',
		fontSize: 15
	}
});

export default StoreListItem;
