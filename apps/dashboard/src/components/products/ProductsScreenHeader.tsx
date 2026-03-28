import { Pressable } from 'react-native';
import { Icon, ScreenHeader } from '@habiti/components';

import { useProductsContext } from './ProductsContext';

const ProductsScreenHeader = () => {
	const { openFilterModal, search, setSearch } = useProductsContext();

	return (
		<ScreenHeader
			title='Products'
			search={{
				placeholder: 'Search products',
				value: search,
				onChangeText: setSearch
			}}
			right={
				<Pressable onPress={openFilterModal}>
					<Icon name='sliders-horizontal' size={20} />
				</Pressable>
			}
			hasBottomBorder
		/>
	);
};

export default ProductsScreenHeader;
