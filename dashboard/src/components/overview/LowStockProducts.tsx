import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import TextButton from '../global/TextButton';
import { ProductsQuery, useProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation';
import CustomImage from '../global/CustomImage';

interface LowStockProductProps {
	onPress(): void;
	product: ProductsQuery['currentStore']['products'][number];
}

const LowStockProduct: React.FC<LowStockProductProps> = ({
	onPress,
	product
}) => {
	return (
		<Pressable onPress={onPress} style={{ marginRight: 8, width: 160 }}>
			<CustomImage uri={product.images[0]?.path} size={160} />
			<Text style={styles.name} numberOfLines={1}>
				{product.name}
			</Text>
			<Text style={styles.price} numberOfLines={1}>
				{formatNaira(product.unitPrice)}
			</Text>
		</Pressable>
	);
};

const LowStockProducts = () => {
	const [{ data }] = useProductsQuery();
	const { navigate } = useNavigation<NavigationProp<MainTabParamList>>();
	const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

	const navigateToProduct = (productId: string) => () => {
		navigation.navigate('Product', { productId });
	};

	const navigateToProducts = () => {
		navigate('Products');
	};

	return (
		<View style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>Low stock products</Text>
				<TextButton size={16} onPress={navigateToProducts}>
					View all
				</TextButton>
			</View>
			<FlatList
				keyExtractor={i => i.id}
				data={data?.currentStore.products}
				renderItem={({ item }) => (
					<LowStockProduct
						onPress={navigateToProduct(item.id)}
						product={item}
					/>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				ListHeaderComponent={<View style={{ width: 8 }} />}
			/>
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
		marginTop: 2,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050'
	},
	price: {
		marginTop: 2,
		fontSize: 16,
		color: '#505050'
	}
});

export default LowStockProducts;
