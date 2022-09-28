import React from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';

import Section from './Section';
import Images from './Images';
import InventoryInput from './InventoryInput';

import { formatNaira } from '../../utils/currency';

interface ProductFormProps {
	productId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
	return (
		<ScrollView
			style={styles.container}
			keyboardDismissMode={Platform.select({
				ios: 'interactive',
				android: 'on-drag'
			})}
		>
			<Section title='Name' placeholder='Product name' field='name' />
			<Section
				title='Description'
				placeholder='Brief product description'
				field='description'
				multiline
			/>
			<Section
				title='Unit Price'
				placeholder={formatNaira(0.0)}
				field='unitPrice'
			/>
			<Images productId={productId} images={product.images} />
			<InventoryInput />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	heading: {
		marginVertical: 16,
		paddingLeft: 16
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	}
});

export default ProductForm;
