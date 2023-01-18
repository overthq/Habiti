import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { useProductsQuery } from '../../types/api';

import TextButton from '../global/TextButton';

const LowStockProducts = () => {
	const [{ data }] = useProductsQuery();

	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<Text style={{ fontSize: 16, fontWeight: '500', color: '#505050' }}>
					Low Stock
				</Text>
				<TextButton>View all</TextButton>
			</View>
			<FlashList
				keyExtractor={i => i.id}
				data={data?.currentStore.products}
				renderItem={({ item }) => (
					<View>
						<View style={styles.placeholder}>
							<Image
								source={{ uri: item.images[0]?.path }}
								style={styles.image}
							/>
						</View>
						<Text>{item.name}</Text>
					</View>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 16,
		paddingHorizontal: 16
	},
	placeholder: {
		borderRadius: 4,
		height: 100,
		width: 100
	},
	image: {
		width: '100%',
		height: '100%'
	}
});

export default LowStockProducts;
