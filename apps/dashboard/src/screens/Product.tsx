import React from 'react';
import { RefreshControl, View } from 'react-native';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { useProductQuery } from '../data/queries';
import { ProductStackParamList } from '../types/navigation';
import { Spacer, TextButton, useTheme } from '@habiti/components';
import ProductDetails from '../components/product/ProductDetails';
import ProductMedia from '../components/product/ProductMedia';
import { ScrollableScreen } from '@habiti/components';
import ProductCategories from '../components/product/ProductCategories';
import useRefresh from '../hooks/useRefresh';
import EditButtons from '../components/product/EditButtons';

const Product: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Main'>>();
	const { setOptions, navigate } =
		useNavigation<NavigationProp<ProductStackParamList>>();

	const { data, isLoading, refetch } = useProductQuery(productId);

	const { refreshing, refresh } = useRefresh({ fetching: isLoading, refetch });
	const { theme } = useTheme();

	useGoBack();

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
