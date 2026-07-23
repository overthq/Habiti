import React from 'react';
import { Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';
import { Icon } from '@habiti/components';

import { useDeleteProductMutation } from '../../data/mutations';

import { shareProduct, viewProductInBrowser } from '../../utils/share';
import { useSheet } from '../../navigation/Sheets';

import type { AppStackParamList } from '../../navigation/types';
import type { Product } from '../../data/types';

interface ProductMenuProps {
	productId: string;
	product: Product;
}

const ProductMenu: React.FC<ProductMenuProps> = ({ productId, product }) => {
	const { setOptions, navigate, goBack } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const deleteProductMutation = useDeleteProductMutation();
	const { openSheet } = useSheet();

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
							onSuccess: () => goBack()
						});
					}
				}
			]
		);
	}, [productId, deleteProductMutation, goBack]);

	const handleEditProduct = React.useCallback(() => {
		navigate('Modal.EditProductDetails', {
			productId,
			name: product.name,
			description: product.description
		});
	}, [navigate, productId, product]);

	const handleShareProduct = React.useCallback(() => {
		shareProduct(productId, product.name);
	}, [productId, product.name]);

	const handleOpenInBrowser = React.useCallback(() => {
		viewProductInBrowser(productId);
	}, [productId]);

	const handleOpenMenu = React.useCallback(() => {
		openSheet('productMenu', {
			onEditProduct: handleEditProduct,
			onDeleteProduct: handleDeleteProduct,
			onShareProduct: handleShareProduct,
			onViewInBrowser: handleOpenInBrowser
		});
	}, [
		openSheet,
		handleEditProduct,
		handleDeleteProduct,
		handleShareProduct,
		handleOpenInBrowser
	]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleOpenMenu}>
					<Icon name='more-vertical' />
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
					menu: {
						singleSelection: false,
						items: [
							{
								type: 'action',
								label: 'Edit',
								icon: { type: 'sfSymbol', name: 'pencil' },
								onPress: handleEditProduct
							},
							{
								type: 'action',
								label: 'View in browser',
								icon: { type: 'sfSymbol', name: 'safari' },
								onPress: handleOpenInBrowser
							},
							{
								type: 'action',
								label: 'Share',
								icon: { type: 'sfSymbol', name: 'square.and.arrow.up' },
								onPress: handleShareProduct
							},
							{
								type: 'action',
								label: 'Delete product',
								icon: { type: 'sfSymbol', name: 'trash' },
								destructive: true,
								onPress: handleDeleteProduct
							}
						]
					}
				}
			]
		});
	}, [
		setOptions,
		handleOpenMenu,
		handleDeleteProduct,
		handleShareProduct,
		handleOpenInBrowser,
		handleEditProduct
	]);

	return null;
};

export default ProductMenu;
