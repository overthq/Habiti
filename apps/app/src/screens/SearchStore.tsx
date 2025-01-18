import { Screen } from '@habiti/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator } from 'react-native';

import SearchStoreHeader from '../components/search-store/SearchStoreHeader';
import StoreListItem from '../components/store/StoreListItem';
// import StoreProducts from '../components/store/StoreProducts';
import { StringWhereMode, useStoreProductsQuery } from '../types/api';
import { AppStackParamList, StoreStackParamList } from '../types/navigation';

const SearchStore = () => {
	const [searchTerm, setSearchTerm] = React.useState('');
	const { params } = useRoute<RouteProp<StoreStackParamList, 'Store.Search'>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ data, fetching }] = useStoreProductsQuery({
		variables: {
			storeId: params.storeId,
			filter: {
				name: { contains: searchTerm, mode: StringWhereMode.Insensitive }
			}
		}
	});

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	return (
		<Screen>
			<SearchStoreHeader
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			{fetching || !data?.store ? (
				<ActivityIndicator />
			) : (
				<FlashList
					data={data.store.products.edges}
					keyExtractor={({ node }) => node.id}
					showsVerticalScrollIndicator={false}
					estimatedItemSize={240}
					renderItem={({ item, index }) => (
						<StoreListItem
							item={item.node}
							onPress={handleProductPress(item.node.id)}
							side={index % 2 === 0 ? 'left' : 'right'}
						/>
					)}
					numColumns={2}
					contentContainerStyle={{ paddingTop: 8 }}
				/>
			)}
		</Screen>
	);
};

export default SearchStore;
