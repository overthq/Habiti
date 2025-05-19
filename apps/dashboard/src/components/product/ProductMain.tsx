import React from 'react';
import { ScrollableScreen, Spacer } from '@habiti/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { formatNaira } from '@habiti/common';

import Section from './Section';
import ProductSettings from './ProductSettings';
import ProductDetails from './ProductDetails';
import ProductMedia from './ProductMedia';
import CurrencyInput from './CurrencyInput';
import InventoryInput from './InventoryInput';
import ProductCategories from './ProductCategories';

import { ProductQuery } from '../../types/api';

interface ProductMainProps {
	product: ProductQuery['product'];
}

const ProductMain: React.FC<ProductMainProps> = ({ product }) => {
	const settingsModalRef = React.useRef<BottomSheetModal>(null);

	return (
		<>
			<ScrollableScreen showsVerticalScrollIndicator={false}>
				<ProductDetails product={product} />
				<ProductMedia images={product.images} />
				<Section
					title='Unit Price'
					placeholder={formatNaira(0.0)}
					field='unitPrice'
				>
					<CurrencyInput value={product.unitPrice} />
				</Section>
				<InventoryInput />
				<ProductCategories categories={product.categories} />
				<Spacer y={8} />
			</ScrollableScreen>
			<ProductSettings productId={product.id} modalRef={settingsModalRef} />
		</>
	);
};

export default ProductMain;
