import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../types/navigation';
import { StoreProductsQuery } from '../../types/api';

interface StoreListItemProps {
	item: StoreProductsQuery['store']['products'][-1];
}

const StoreListItem: React.FC<StoreListItemProps> = ({ item }) => {
	const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

	return (
		<View style={styles.container}>
			<TouchableOpacity
				key={item.id}
				style={styles.pressable}
				onPress={() => navigate('Product', { productId: item.id })}
				activeOpacity={0.8}
			>
				<View style={styles.image}>
					{item.images[0] &&
						{
							/*<Image
							style={{ height: '100%', width: '100%' }}
							source={{ uri: item.images[0].path }}
						/>*/
						}}
				</View>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.price}>${item.unitPrice}</Text>
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
		borderRadius: 4,
		backgroundColor: '#D3D3D3',
		height: 200,
		width: '100%',
		marginBottom: 5,
		overflow: 'hidden'
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
