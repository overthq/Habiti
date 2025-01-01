import { CustomImage, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { ProductQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface RelatedProductsProps {
	products: ProductQuery['product']['relatedProducts'];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	return (
		<View style={styles.container}>
			<Typography
				variant='label'
				weight='medium'
				style={{ marginBottom: 4, marginLeft: 16 }}
			>
				Related products
			</Typography>
			<ScrollView
				contentContainerStyle={styles.scroll}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{products.map(product => (
					<TouchableOpacity
						key={product.id}
						onPress={() => navigate('Product', { productId: product.id })}
					>
						<View style={{ marginLeft: 8 }}>
							<CustomImage
								uri={product.images[0]?.path}
								height={120}
								width={120}
							/>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16
	},
	scroll: {
		paddingLeft: 8,
		paddingRight: 16
	}
});

export default RelatedProducts;
