import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TextButton from '../global/TextButton';
import { useProductsQuery } from '../../types/api';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation';
import Typography from '../global/Typography';
import LowStockProduct from './LowStockProduct';

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
				<Typography variant='label' weight='bold' size='large'>
					Low stock products
				</Typography>
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
	}
});

export default LowStockProducts;
