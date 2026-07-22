import { IconButton, ScreenHeader } from '@habiti/components';

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
				<IconButton
					name='sliders-horizontal'
					size={20}
					onPress={openFilterModal}
					style={{ marginVertical: -10, marginRight: -12 }}
				/>
			}
			hasBottomBorder
		/>
	);
};

export default ProductsScreenHeader;
