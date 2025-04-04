import { formatNaira } from '@habiti/common';
import { ScrollableScreen, Spacer } from '@habiti/components';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import Categories from './Categories';
import CurrencyInput from './CurrencyInput';
import Images from './Images';
import InventoryInput from './InventoryInput';
// import ProductOptions from './ProductOptions';
// import ProductReviews from './ProductReviews';
import Section from './Section';
import { ProductQuery } from '../../types/api';

interface ProductFormProps {
	images?: ProductQuery['product']['images'];
	options?: ProductQuery['product']['options'];
	imagesToUpload: string[];
	setImagesToUpload: React.Dispatch<React.SetStateAction<string[]>>;
	selectedCategories: string[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
	mode: 'add' | 'edit';
	categories: ProductQuery['product']['categories'];
}

const ProductForm: React.FC<ProductFormProps> = ({
	images,
	options,
	imagesToUpload,
	setImagesToUpload,
	mode,
	selectedCategories,
	setSelectedCategories,
	categories
}) => {
	return (
		<ScrollableScreen
			style={styles.container}
			keyboardDismissMode={Platform.select({
				ios: 'interactive',
				android: 'on-drag'
			})}
			showsVerticalScrollIndicator={false}
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
			>
				<CurrencyInput />
			</Section>
			<Images
				images={images}
				imagesToUpload={imagesToUpload}
				setImagesToUpload={setImagesToUpload}
			/>
			<InventoryInput />
			{mode === 'edit' && (
				<>
					{/* <ProductOptions options={options} />
					<ProductReviews /> */}
					<Categories
						categories={categories}
						selectedCategories={selectedCategories}
						setSelectedCategories={setSelectedCategories}
					/>
					<Spacer y={8} />
				</>
			)}
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 8
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
