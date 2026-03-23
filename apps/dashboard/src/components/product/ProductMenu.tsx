import React from 'react';
import { Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Icon } from '@habiti/components';

import ProductMenuModal from './ProductMenuModal';

import { useDeleteProductMutation } from '../../data/mutations';

import { shareProduct, viewProductInBrowser } from '../../utils/share';

import type { AppStackParamList } from '../../types/navigation';
import type { Product } from '../../data/types';

interface ProductMenuProps {
	productId: string;
	product: Product;
}

const ProductMenu: React.FC<ProductMenuProps> = ({ productId, product }) => {
	const { setOptions, navigate, goBack } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const deleteProductMutation = useDeleteProductMutation();
	const optionsModalRef = React.useRef<BottomSheetModal>(null);

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
	}, [productId, deleteProductMutation, navigate]);

	const handleEditProduct = React.useCallback(() => {
		navigate('Modals.EditProductDetails', {
			productId,
			name: product.name,
			description: product.description
		});
	}, [productId, product]);

	const handleShareProduct = React.useCallback(() => {
		shareProduct(productId, product.name);
	}, [productId, product.name]);

	const handleOpenInBrowser = React.useCallback(() => {
		viewProductInBrowser(productId);
	}, [productId]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton onPress={() => optionsModalRef.current?.present()}>
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
						items: [
							{
								type: 'action',
								label: 'Edit',
								icon: { type: 'sfSymbol', name: 'pencil' },
								onPress: () => {
									handleEditProduct();
								}
							},
							{
								type: 'action',
								label: 'View in browser',
								icon: { type: 'sfSymbol', name: 'safari' },
								onPress: () => {
									handleOpenInBrowser();
								}
							},
							{
								type: 'action',
								label: 'Share',
								icon: { type: 'sfSymbol', name: 'square.and.arrow.up' },
								onPress: () => {
									handleShareProduct();
								}
							},
							{
								type: 'action',
								label: 'Delete product',
								icon: { type: 'sfSymbol', name: 'trash' },
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
		product.name,
		product.description,
		productId,
		navigate,
		handleDeleteProduct,
		handleShareProduct,
		handleOpenInBrowser,
		handleEditProduct
	]);

	return (
		<ProductMenuModal
			modalRef={optionsModalRef}
			onEditProduct={handleEditProduct}
			onDeleteProduct={handleDeleteProduct}
			onShareProduct={handleShareProduct}
			onViewInBrowser={handleOpenInBrowser}
		/>
	);
};

export default ProductMenu;
