import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useItemQuery } from '../types';
import { Icon } from '../components/icons';
import { CartsContext } from '../contexts/CartsContext';

const Item = () => {
	const { params } = useRoute();
	const [quantity, setQuantity] = React.useState(0);
	const { addItemToCart } = React.useContext(CartsContext);
	const [{ data, fetching }] = useItemQuery({
		variables: { itemId: params.itemId }
	});

	return (
		<View style={styles.container}>
			<View style={styles.imagePlaceholder} />
			<View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
				<Text
					style={{
						textTransform: 'uppercase',
						color: '#777777',
						fontWeight: 'bold'
					}}
				>
					{data?.item.store.name}
				</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 5
					}}
				>
					<Text style={{ fontWeight: 'bold', fontSize: 26 }}>
						{data?.item.name}
					</Text>
					<Text style={{ fontSize: 20 }}>${data?.item.price_per_unit}</Text>
				</View>
				<Text style={{ fontSize: 16, color: '#777777' }}>
					{data?.item.description}
				</Text>
				<View
					style={{
						width: '100%',
						height: 1,
						backgroundColor: '#D3D3D3',
						marginVertical: 10
					}}
				/>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={{ fontSize: 16, fontWeight: '500' }}>Quantity</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TouchableOpacity
							style={{ marginRight: 7.5 }}
							onPress={() => {
								if (quantity !== 0) {
									setQuantity(quantity - 1);
								}
							}}
						>
							<Icon name='minus' color='#D3D3D3' />
						</TouchableOpacity>
						<Text style={{ fontSize: 16, fontVariant: ['tabular-nums'] }}>
							{quantity}
						</Text>
						<TouchableOpacity
							style={{ marginLeft: 7.5 }}
							onPress={() => {
								setQuantity(quantity + 1);
							}}
						>
							<Icon name='plus' color='#D3D3D3' />
						</TouchableOpacity>
					</View>
				</View>
				<TouchableOpacity
					style={styles.cartButton}
					onPress={() => {
						if (data?.item.store_id) {
							addItemToCart({
								storeId: data?.item.store_id,
								itemId: data?.item.id,
								quantity
							});
						}
					}}
				>
					<View style={{ marginRight: 5 }}>
						<Icon size={22} color='#D3D3D3' name='plus' />
					</View>
					<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#D3D3D3' }}>
						Add to Cart
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	imagePlaceholder: {
		height: 300,
		width: '100%',
		backgroundColor: '#D3D3D3'
	},
	cartButton: {
		marginTop: 10,
		width: '100%',
		height: 45,
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#505050'
	}
});

export default Item;
