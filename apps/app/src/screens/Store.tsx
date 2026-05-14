import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Screen } from '@habiti/components';
import {
	useRoute,
	RouteProp,
	useNavigation,
	NavigationProp
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';

import StoreHeader from '../components/store/StoreHeader';
import StoreProducts, {
	StoreListItem
} from '../components/store/StoreProducts';

import { useStoreQuery, useStoreProductsQuery } from '../data/queries';
import useDebounced from '../hooks/useDebounced';

import type {
	AppStackParamList,
	StoreStackParamList
} from '../navigation/types';

const Store = () => {
	const { params } = useRoute<RouteProp<StoreStackParamList, 'Store.Main'>>();
	const { data, isLoading } = useStoreQuery(params.storeId);
	const [searchTerm, setSearchTerm] = React.useState<string>();
	const [activeCategory, setActiveCategory] = React.useState<string>();
	const { top } = useSafeAreaInsets();

	if (isLoading || !data?.store) return <ActivityIndicator />;

	return (
		<Screen style={{ padding: 0, paddingTop: top }}>
			<StoreHeader
				store={data.store}
				activeCategory={activeCategory}
				setActiveCategory={setActiveCategory}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			<Animated.View style={{ flex: 1 }} layout={LinearTransition}>
				<StoreProducts
					store={data.store}
					activeCategory={activeCategory}
					searchTerm={searchTerm}
				/>
				<SearchStore searchTerm={searchTerm} />
			</Animated.View>
		</Screen>
	);
};

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

export default Store;
