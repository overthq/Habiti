import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { CustomImage, Spacer, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { formatNaira } from '@habiti/common';

import { AppStackParamList } from '../../navigation/types';
import { useProductContext } from './ProductContext';

const RelatedProducts: React.FC = () => {
	const { relatedProducts } = useProductContext();
	// @ts-expect-error - push is a valid navigation prop
	const { push } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<View style={styles.container}>
			<Typography variant='label' weight='medium' style={{ marginLeft: 16 }}>
				Related products
			</Typography>
			<Spacer y={8} />
			<ScrollView
				contentContainerStyle={styles.scroll}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{relatedProducts.map(product => (
					<Pressable
						key={product.id}
						onPress={() => push('Product', { productId: product.id })}
					>
						<CustomImage
							uri={product.images[0]?.path}
							height={120}
							width={120}
						/>
						<Spacer y={4} />
						<Typography weight='medium' style={{ fontSize: 14 }}>
							{product.name}
						</Typography>
						<Typography
							weight='medium'
							variant='secondary'
							style={{ fontSize: 14 }}
						>
							{formatNaira(product.unitPrice)}
						</Typography>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scroll: {
		paddingHorizontal: 16,
		gap: 12
	}
});

export default RelatedProducts;
