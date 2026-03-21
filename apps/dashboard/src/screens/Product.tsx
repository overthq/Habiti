import React from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';

import { useProductQuery } from '../data/queries';
import { useDeleteProductMutation } from '../data/mutations';
import { shareProduct, viewProductInBrowser } from '../utils/share';
import {
	AppStackParamList,
	ProductsStackParamList,
	ProductStackParamList
} from '../types/navigation';
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
		useNavigation<NavigationProp<AppStackParamList & ProductsStackParamList>>();

	const { data, isRefetching, refetch } = useProductQuery(productId);
	const deleteProductMutation = useDeleteProductMutation();

	const { theme } = useTheme();

	const handleDeleteProduct = React.useCallback(() => {
		Alert.alert(
			'Delete product',
			'Are you sure you want to delete this product? This action cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						deleteProductMutation.mutate(productId, {
							onSuccess: () => navigate('ProductsList')
						});
					}
				}
			]
		);
	}, [productId, deleteProductMutation, navigate]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton
					onPress={() =>
						navigate('Modals.EditProductDetails', {
							productId,
							name: data?.product?.name,
							description: data?.product?.description
						})
					}
				>
					<Typography>Edit</Typography>
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'menu',
					label: 'Options',
					icon: {
						type: 'sfSymbol',
						name: 'ellipsis'
					},
					changesSelectionAsPrimaryAction: false,
					menu: {
						items: [
							{
								type: 'action',
								label: 'Edit',
								icon: {
									type: 'sfSymbol',
									name: 'pencil'
								},
								onPress: () => {
									navigate('Modals.EditProductDetails', {
										productId,
										name: data?.product?.name,
										description: data?.product?.description
									});
								}
							},
							{
								type: 'action',
								label: 'View in browser',
								icon: {
									type: 'sfSymbol',
									name: 'safari'
								},
								onPress: () => {
									viewProductInBrowser(productId);
								}
							},
							{
								type: 'action',
								label: 'Share',
								icon: {
									type: 'sfSymbol',
									name: 'square.and.arrow.up'
								},
								onPress: () => {
									shareProduct(productId, data?.product?.name ?? '');
								}
							},
							{
								type: 'action',
								label: 'Delete product',
								icon: {
									type: 'sfSymbol',
									name: 'trash'
								},
								destructive: true,
								onPress: () => {
									handleDeleteProduct();
								}
							}
						]
					}
				}
			]
		});
	}, [
		data?.product?.name,
		data?.product?.description,
		productId,
		navigate,
		handleDeleteProduct
	]);

	if (!data?.product) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl
					refreshing={isRefetching}
					onRefresh={refetch}
					tintColor={theme.text.secondary}
				/>
			}
			showsVerticalScrollIndicator={true}
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
	);
};

export default Product;
