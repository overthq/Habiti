import React from 'react';
import {
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Product, Store } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface StoresViewProps {
	data: Store[];
}

const StoresView: React.FC<StoresViewProps> = ({ data }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<FlatList
			keyExtractor={s => s.id}
			data={data}
			renderItem={({ item }) => (
				<TouchableOpacity
					onPress={() => navigate('Store', { storeId: item.id })}
					style={styles.resultRow}
				>
					{item.image && (
						<Image
							source={{ uri: item.image.path }}
							style={styles.resultRowThumbnail}
						/>
					)}
					<Text style={{ fontSize: 16 }}>{item.name}</Text>
				</TouchableOpacity>
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
		<FlatList
			keyExtractor={i => i.id}
			data={data}
			renderItem={({ item }) => (
				<TouchableOpacity
					onPress={handleProductPress(item.id)}
					style={styles.resultRow}
				>
					{item.images[0] && (
						<Image
							source={{ uri: item.images[0].path }}
							style={styles.resultRowThumbnail}
						/>
					)}

					<Text style={{ fontSize: 16 }}>{item.name}</Text>
				</TouchableOpacity>
			)}
		/>
	);
};

interface SearchResultsProps {
	searchData: any;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchData }) => {
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'stores', title: 'Stores' },
		{ key: 'products', title: 'Products' }
	]);

	const renderScene = SceneMap({
		stores: () => <StoresView data={searchData.stores} />,
		items: () => <ProductsView data={searchData.products} />
	});

	return (
		<TabView
			navigationState={{ index, routes }}
			renderTabBar={props => (
				<TabBar
					{...props}
					activeColor='black'
					inactiveColor='#505050'
					indicatorStyle={{ backgroundColor: 'black' }}
					getLabelText={({ route }) =>
						(route.title?.charAt(0).toUpperCase() as string) +
						(route.title?.slice(1) as string)
					}
					style={{ backgroundColor: 'white' }}
				/>
			)}
			renderScene={renderScene}
			onIndexChange={setIndex}
		/>
	);
};

const styles = StyleSheet.create({
	resultRow: {
		width: '100%',
		flexDirection: 'row',
		padding: 8,
		alignItems: 'center'
	},
	resultRowThumbnail: {
		width: 35,
		height: 35,
		marginRight: 8,
		borderRadius: 4
	}
});

export default SearchResults;
