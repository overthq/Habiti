import React from 'react';
import { ScrollView, Platform, StyleSheet } from 'react-native';

import Section from './Section';
import Images from './Images';
import InventoryInput from './InventoryInput';

import { formatNaira } from '../../utils/currency';
import { ProductQuery } from '../../types/api';

interface ProductFormProps {
	images?: ProductQuery['product']['images'];
	imagesToUpload: string[];
	setImagesToUpload: React.Dispatch<React.SetStateAction<string[]>>;
}

const ProductForm: React.FC<ProductFormProps> = ({
	images,
	imagesToUpload,
	setImagesToUpload
}) => {
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
				inputProps={{ multiline: true, textAlignVertical: 'top' }}
			/>
			<Section
				title='Unit Price'
				placeholder={formatNaira(0.0)}
				field='unitPrice'
			/>
			<Images
				images={images}
				imagesToUpload={imagesToUpload}
				setImagesToUpload={setImagesToUpload}
			/>
			<InventoryInput />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 8,
		backgroundColor: '#FFFFFF'
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
