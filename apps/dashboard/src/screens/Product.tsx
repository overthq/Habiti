import React from 'react';
import { RefreshControl, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { useProductQuery } from '../types/api';
import { ProductStackParamList } from '../types/navigation';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ProductSettings from '../components/product/ProductSettings';
import { Spacer, useTheme } from '@habiti/components';
import ProductDetails from '../components/product/ProductDetails';
import Section from '../components/product/Section';
import { formatNaira } from '@habiti/common';
import CurrencyInput from '../components/product/CurrencyInput';
import ProductMedia from '../components/product/ProductMedia';
import InventoryInput from '../components/product/InventoryInput';
import { ScrollableScreen } from '@habiti/components';
import ProductCategories from '../components/product/ProductCategories';
import useRefresh from '../hooks/useRefresh';

const Product: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Main'>>();

	const settingsModalRef = React.useRef<BottomSheetModal>(null);

	const [{ data, fetching }, refetch] = useProductQuery({
		variables: { id: productId }
	});

	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { theme } = useTheme();

	useGoBack();

	if (!data?.product) {
		return <View />;
	}

	return (
		<>
			<ScrollableScreen
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
						tintColor={theme.text.secondary}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				<ProductDetails product={data.product} />
				<Spacer y={8} />
				<ProductMedia images={data.product.images} productId={productId} />
				<Spacer y={8} />
				<Section title='Price' placeholder={formatNaira(0.0)} field='unitPrice'>
					<CurrencyInput value={data.product.unitPrice} />
				</Section>
				<Spacer y={8} />
				<InventoryInput />
				<Spacer y={8} />
				<ProductCategories
					categories={data.product.categories}
					productId={productId}
				/>
				<Spacer y={8} />
			</ScrollableScreen>
			<ProductSettings productId={productId} modalRef={settingsModalRef} />
		</>
	);
};

export default Product;
