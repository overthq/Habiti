import { Screen } from '@habiti/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';

import StoreListItem from '../components/store/StoreListItem';
import { useStoreProductsQuery } from '../data/queries';
import { AppStackParamList, StoreStackParamList } from '../types/navigation';
import useDebounced from '../hooks/useDebounced';

interface SearchStoreProps {
	searchTerm: string;
}

const SearchStore: React.FC<SearchStoreProps> = ({ searchTerm }) => {
	const debouncedSearchTerm = useDebounced(searchTerm);

	const { params } = useRoute<RouteProp<StoreStackParamList, 'Store.Search'>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const filter = debouncedSearchTerm
		? { name: { contains: debouncedSearchTerm, mode: 'insensitive' } }
		: undefined;

	const { data, isLoading } = useStoreProductsQuery(params.storeId, filter);

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (isLoading || !data?.products) {
		return <View />;
	}

	return (
		<Screen style={{ display: !!searchTerm ? 'flex' : 'none' }}>
			<FlashList
				keyboardShouldPersistTaps='handled'
				data={data.products}
				keyExtractor={item => item.id}
				showsVerticalScrollIndicator={false}
				renderItem={({ item, index }) => (
					<StoreListItem
						item={item}
						onPress={handleProductPress(item.id)}
						side={index % 2 === 0 ? 'left' : 'right'}
					/>
				)}
				numColumns={2}
				contentContainerStyle={{ paddingTop: 8 }}
			/>
		</Screen>
	);
};

export default SearchStore;
