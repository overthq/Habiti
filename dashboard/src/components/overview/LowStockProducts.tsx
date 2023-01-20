import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import TextButton from '../global/TextButton';
import { ProductsQuery, useProductsQuery } from '../../types/api';

interface LowStockProductProps {
	product: ProductsQuery['currentStore']['products'][number];
}

const LowStockProduct: React.FC<LowStockProductProps> = ({ product }) => {
	return (
		<View style={{ marginRight: 8, width: 160 }}>
			<View style={styles.placeholder}>
				<Image source={{ uri: product.images[0]?.path }} style={styles.image} />
			</View>
			<Text style={styles.name} numberOfLines={1}>
				{product.name}
			</Text>
		</View>
	);
};

const LowStockProducts = () => {
	const [{ data }] = useProductsQuery();

	return (
		<View style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>Low Stock</Text>
				<TextButton>View all</TextButton>
			</View>
			<View style={{ height: 200, width: '100%' }}>
				<FlashList
					keyExtractor={i => i.id}
					data={data?.currentStore.products}
					estimatedItemSize={200}
					ListHeaderComponent={<View style={{ width: 8 }} />}
					renderItem={({ item }) => <LowStockProduct product={item} />}
					horizontal
					showsHorizontalScrollIndicator={false}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 16
	},
	heading: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 4
	},
	title: {
		fontSize: 16,
		fontWeight: '500',
		color: '#505050'
	},
	placeholder: {
		borderRadius: 4,
		height: 160,
		width: 160,
		backgroundColor: '#D3D3D3',
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	name: {
		fontSize: 16
	}
});

export default LowStockProducts;
