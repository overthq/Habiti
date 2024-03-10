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
import { StyleSheet, View, Pressable } from 'react-native';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';

import RecentSearches from './RecentSearches';
import { Product, Store } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface StoresViewProps {
	data: Store[];
}

const StoresView: React.FC<StoresViewProps> = ({ data }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<FlashList
			keyExtractor={s => s.id}
			data={data}
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

interface ProductsViewProps {
	data: Product[];
}

const ProductsView: React.FC<ProductsViewProps> = ({ data }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	return (
		<FlashList
			keyExtractor={i => i.id}
			data={data}
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
	const searchData = { stores: [], products: [] };
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'stores', title: 'Stores' },
		{ key: 'products', title: 'Products' }
	]);

	// const renderScene = SceneMap({
	// 	stores: () => <StoresView data={searchData.stores} />,
	// 	items: () => <ProductsView data={searchData.products} />
	// });

	const renderScene = SceneMap({
		stores: () => <View />,
		products: () => <View />
	});

	return (
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
