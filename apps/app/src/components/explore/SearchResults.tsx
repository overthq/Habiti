import {
	CustomImage,
	Screen,
	Spacer,
	Typography,
	useTheme
} from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';

import RecentSearches from './RecentSearches';
import { SearchProvider, useSearchContext } from './SearchContext';
// import { useSearchQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

const StoresView: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { fetching, stores } = useSearchContext();

	if (fetching || !stores) {
		return <View />;
	}

	return (
		<FlashList
			keyExtractor={s => s.id}
			data={stores}
			renderItem={({ item }) => (
				<Pressable
					onPress={() => navigate('Store', { storeId: item.id })}
					style={styles.row}
				>
					<CustomImage uri={item.image?.path} circle height={35} width={35} />
					<Spacer x={8} />
					<Typography>{item.name}</Typography>
				</Pressable>
			)}
		/>
	);
};

const ProductsView: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { fetching, products } = useSearchContext();

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (fetching || !products) {
		return <View />;
	}

	return (
		<FlashList
			keyExtractor={i => i.id}
			data={products}
			renderItem={({ item }) => (
				<Pressable onPress={handleProductPress(item.id)} style={styles.row}>
					<CustomImage
						uri={item.images[0]?.path}
						circle
						height={35}
						width={35}
					/>
					<Spacer x={8} />
					<Typography>{item.name}</Typography>
				</Pressable>
			)}
		/>
	);
};

interface SearchResultsProps {
	searchOpen: boolean;
	searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
	searchOpen,
	searchTerm
}) => {
	return (
		<Screen style={{ display: searchOpen ? 'flex' : 'none' }}>
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
	// const [{ fetching, data }] = useSearchQuery({ variables: { searchTerm } });

	const renderScene = SceneMap({
		stores: StoresView,
		products: ProductsView
	});

	return (
		<SearchProvider searchTerm={searchTerm}>
			<TabView
				style={{ display: searchTerm ? 'flex' : 'none' }}
				navigationState={{ index, routes }}
				renderTabBar={props => (
					<TabBar
						{...props}
						activeColor={theme.text.primary}
						inactiveColor={theme.text.secondary}
						indicatorStyle={{ backgroundColor: theme.text.primary }}
						labelStyle={{ textTransform: 'none', fontSize: 16 }}
						style={{ backgroundColor: theme.screen.background }}
					/>
				)}
				renderScene={renderScene}
				onIndexChange={setIndex}
			/>
		</SearchProvider>
	);
};

const styles = StyleSheet.create({
	row: {
		width: '100%',
		flexDirection: 'row',
		padding: 8,
		alignItems: 'center'
	}
});

export default SearchResults;
