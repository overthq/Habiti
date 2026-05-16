import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import {
	Avatar,
	CustomImage,
	Row,
	Screen,
	SectionHeader,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import { SearchProvider, useSearchContext } from './SearchContext';

import type {
	AppStackParamList,
	HomeStackParamList
} from '../../navigation/types';
import type { Product, Store } from '../../data/types';

const StoresView = () => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
	const { stores } = useSearchContext();

	const handleStorePress = (storeId: string) => () => {
		navigate('Home.Store', { storeId });
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
			keyboardShouldPersistTaps='handled'
		/>
	);
};

const ProductsView = () => {
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
			keyboardShouldPersistTaps='handled'
			keyExtractor={p => p.id}
			data={products}
			renderItem={({ item }) => (
				<ProductResultRow
					product={item}
					onPress={handleProductPress(item.id)}
				/>
			)}
		/>
	);
};

interface SearchResultsProps {
	searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm }) => {
	return (
		<View style={{ flex: 1 }}>
			<RecentSearches display={!searchTerm} />
			<SearchResultsMain searchTerm={searchTerm} />
		</View>
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

interface ProductResultRowProps {
	product: Product;
	onPress(): void;
}

const ProductResultRow: React.FC<ProductResultRowProps> = ({
	product,
	onPress
}) => {
	return (
		<Row onPress={onPress} style={styles.productContainer}>
			<CustomImage uri={product.images[0]?.path} height={35} width={35} />
			<Spacer x={8} />
			<Typography>{product.name}</Typography>
		</Row>
	);
};

interface StoreResultRowProps {
	store: Store;
	onPress(): void;
}

const StoreResultRow: React.FC<StoreResultRowProps> = ({ store, onPress }) => {
	return (
		<Row onPress={onPress} style={styles.storeContainer}>
			<Avatar
				uri={store.image?.path}
				circle
				size={44}
				fallbackText={store.name}
			/>
			<Spacer x={8} />
			<Typography>{store.name}</Typography>
		</Row>
	);
};

interface RecentSearchesProps {
	display: boolean;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ display }) => {
	const { theme } = useTheme();

	return (
		<View
			style={{
				display: display ? 'flex' : 'none',
				flex: 1,
				padding: 0,
				paddingTop: 12,
				borderTopColor: theme.border.color
			}}
		>
			<SectionHeader title='Recent searches' />
		</View>
	);
};

const styles = StyleSheet.create({
	productContainer: {
		flexDirection: 'row',
		padding: 4,
		alignItems: 'center'
	},
	storeContainer: {
		flexDirection: 'row',
		padding: 8,
		paddingHorizontal: 16,
		alignItems: 'center'
	}
});

export default SearchResults;
