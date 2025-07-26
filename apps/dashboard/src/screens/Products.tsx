import React from 'react';
import { Pressable } from 'react-native';
import { Icon, Screen, ScreenHeader } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FAB from '../components/products/FAB';
import ProductList from '../components/products/ProductList';
import { AppStackParamList } from '../types/navigation';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ProductsProvider } from '../components/products/ProductsContext';

const Products: React.FC = () => {
	const { top } = useSafeAreaInsets();
	const filterModalRef = React.useRef<BottomSheetModal>(null);
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleOpenFilterSheet = () => {
		filterModalRef.current?.present();
	};

	const handleOpenAddProduct = () => {
		navigate('Add Product');
	};

	return (
		<ProductsProvider>
			<Screen style={{ paddingTop: top }}>
				<ScreenHeader
					title='Products'
					right={
						<Pressable onPress={handleOpenFilterSheet}>
							<Icon name='sliders-horizontal' size={20} />
						</Pressable>
					}
					hasBottomBorder
				/>
				<ProductList modalRef={filterModalRef} />
				<FAB onPress={handleOpenAddProduct} text='New Product' />
			</Screen>
		</ProductsProvider>
	);
};

export default Products;
