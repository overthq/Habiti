import { Screen, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';

import ProductResultRow from './ProductResultRow';
import RecentSearches from './RecentSearches';
import { SearchProvider, useSearchContext } from './SearchContext';
import StoreResultRow from './StoreResultRow';
import { AppStackParamList, HomeStackParamList } from '../../types/navigation';

const StoresView: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
	const { stores } = useSearchContext();

	const handleStorePress = (storeId: string) => () => {
		navigate('Home.Store', {
			screen: 'Store.Main',
			params: { storeId }
		});
	};

	if (!stores) {
		return <View />;
	}

	return (
		<FlashList
			keyExtractor={s => s.id}
			data={stores}
			renderItem={({ item }) => (
				<StoreResultRow store={item} onPress={handleStorePress(item.id)} />
			)}
			estimatedItemSize={100}
		/>
	);
};

const ProductsView: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { products } = useSearchContext();

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	return (
		<FlashList
			keyExtractor={p => p.node.id}
			data={products.edges}
			renderItem={({ item }) => (
				<ProductResultRow
					product={item.node}
					onPress={handleProductPress(item.node.id)}
				/>
			)}
			estimatedItemSize={100}
		/>
	);
};

interface SearchResultsProps {
	searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm }) => {
	return (
		<Screen>
			<RecentSearches display={!searchTerm} />
			<SearchResultsMain searchTerm={searchTerm} />
		</Screen>
	);
};

interface SearchResultsMainProps {
	searchTerm: string;
}

const SearchResultsMain: React.FC<SearchResultsMainProps> = ({
	searchTerm
}) => {
	const { theme } = useTheme();
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'stores', title: 'Stores' },
		{ key: 'products', title: 'Products' }
	]);

	const renderScene = SceneMap({
		stores: StoresView,
		products: ProductsView
	});

	return (
		<SearchProvider searchTerm={searchTerm}>
			<TabView
				style={{ display: searchTerm ? 'flex' : 'none' }}
				navigationState={{ index, routes }}
				keyboardDismissMode='none'
				renderTabBar={props => (
					<TabBar
						{...props}
						activeColor={theme.text.primary}
						inactiveColor={theme.text.secondary}
						indicatorStyle={{ backgroundColor: theme.text.primary }}
						style={{ backgroundColor: theme.screen.background }}
					/>
				)}
				renderScene={renderScene}
				onIndexChange={setIndex}
			/>
		</SearchProvider>
	);
};

export default SearchResults;
