import React from 'react';
import { RefreshControl, View } from 'react-native';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';

import { useProductQuery } from '../data/queries';
import { ProductStackParamList } from '../types/navigation';
import { Spacer, Typography, useTheme } from '@habiti/components';
import ProductDetails from '../components/product/ProductDetails';
import ProductMedia from '../components/product/ProductMedia';
import { ScrollableScreen } from '@habiti/components';
import ProductCategories from '../components/product/ProductCategories';
import EditButtons from '../components/product/EditButtons';

const Product = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Main'>>();
	const { setOptions, navigate } =
		useNavigation<NavigationProp<ProductStackParamList>>();

	const { data, isRefetching, refetch } = useProductQuery(productId);

	const { theme } = useTheme();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton
					onPress={() =>
						navigate('Product.Details', {
							productId,
							name: data?.product?.name,
							description: data?.product?.description
						})
					}
				>
					<Typography>Edit</Typography>
				</HeaderButton>
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
						refreshing={isRefetching}
						onRefresh={refetch}
						tintColor={theme.text.secondary}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				<Spacer y={16} />

				<ProductDetails product={data.product} />

				<Spacer y={16} />

				<EditButtons product={data.product} />

				<Spacer y={16} />

				<ProductMedia images={data.product.images} productId={productId} />

				<Spacer y={16} />

				<ProductCategories
					categories={data.product.categories}
					productId={productId}
				/>
			</ScrollableScreen>
		</>
	);
};

export default Product;
