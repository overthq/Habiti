import React from 'react';
import { RefreshControl, View } from 'react-native';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { useProductQuery } from '../types/api';
import { ProductStackParamList } from '../types/navigation';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ProductSettings from '../components/product/ProductSettings';
import { Spacer, TextButton, useTheme } from '@habiti/components';
import ProductDetails from '../components/product/ProductDetails';
import ProductPrice from '../components/product/ProductPrice';
import ProductMedia from '../components/product/ProductMedia';
import InventoryInput from '../components/product/InventoryInput';
import { ScrollableScreen } from '@habiti/components';
import ProductCategories from '../components/product/ProductCategories';
import useRefresh from '../hooks/useRefresh';
import ProductPriceModal from '../components/modals/ProductPriceModal';
import ProductInventoryModal from '../components/modals/ProductInventoryModal';

const Product: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Main'>>();
	const { setOptions, navigate } =
		useNavigation<NavigationProp<ProductStackParamList>>();

	const settingsModalRef = React.useRef<BottomSheetModal>(null);
	const priceModalRef = React.useRef<BottomSheetModal>(null);
	const inventoryModalRef = React.useRef<BottomSheetModal>(null);

	const [{ data, fetching }, refetch] = useProductQuery({
		variables: { id: productId }
	});

	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { theme } = useTheme();

	useGoBack();

	const openPriceModal = () => {
		priceModalRef.current?.present();
	};

	const openInventoryModal = () => {
		inventoryModalRef.current?.present();
	};

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<TextButton
					variant='secondary'
					onPress={() =>
						navigate('Product.Details', {
							productId,
							name: data?.product?.name,
							description: data?.product?.description
						})
					}
				>
					Edit
				</TextButton>
			)
		});
	}, [data?.product?.name, data?.product?.description, productId, navigate]);

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
				<Spacer y={16} />

				<ProductDetails product={data.product} />

				<Spacer y={16} />

				<ProductPrice value={data.product.unitPrice} onPress={openPriceModal} />

				<Spacer y={16} />

				<ProductMedia images={data.product.images} productId={productId} />

				<Spacer y={16} />

				<InventoryInput
					onPress={openInventoryModal}
					quantity={data.product.quantity}
				/>

				<Spacer y={16} />

				<ProductCategories
					categories={data.product.categories}
					productId={productId}
				/>
			</ScrollableScreen>

			<ProductSettings productId={productId} modalRef={settingsModalRef} />
			<ProductPriceModal
				modalRef={priceModalRef}
				productId={productId}
				initialPrice={data.product.unitPrice}
			/>
			<ProductInventoryModal
				productId={productId}
				initialQuantity={data.product.quantity}
				modalRef={inventoryModalRef}
			/>
		</>
	);
};

export default Product;
