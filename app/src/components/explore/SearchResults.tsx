import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { stores, items } from '../../api';

const StoresView: React.FC<{ data: typeof stores }> = ({ data }) => {
	const { navigate } = useNavigation();
	return (
		<View>
			<FlatList
				keyExtractor={s => s.id}
				data={data}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => navigate('Store', { storeId: item.id })}
						style={{
							width: '100%',
							flexDirection: 'row',
							padding: 8,
							alignItems: 'center'
						}}
					>
						<Image
							source={{ uri: item.avatarUrl }}
							style={{
								width: 35,
								height: 35,
								marginRight: 8,
								borderRadius: 4
							}}
						/>
						<Text style={{ fontSize: 16 }}>{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
};

const ItemsView: React.FC<{ data: typeof items }> = ({ data }) => {
	const { navigate } = useNavigation();
	return (
		<View>
			<FlatList
				keyExtractor={i => i.id}
				data={data}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => navigate('Item', { itemId: item.id })}
						style={{
							width: '100%',
							flexDirection: 'row',
							padding: 8,
							alignItems: 'center'
						}}
					>
						<Image
							source={{ uri: item.imageUrl }}
							style={{
								width: 35,
								height: 35,
								marginRight: 8,
								borderRadius: 4
							}}
						/>
						<Text style={{ fontSize: 16 }}>{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
			<Text>{JSON.stringify(data)}</Text>
		</View>
	);
};

interface SearchResultsProps {
	searchData: any;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchData }) => {
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'stores', title: 'Stores' },
		{ key: 'items', title: 'Items' }
	]);

	const renderScene = SceneMap({
		// eslint-disable-next-line
		stores: () => <StoresView data={searchData.stores} />,
		// eslint-disable-next-line
		items: () => <ItemsView data={searchData.items} />
	});

	const renderTabBar = props => (
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
	);

	return (
		<TabView
			navigationState={{ index, routes }}
			renderTabBar={renderTabBar}
			renderScene={renderScene}
			onIndexChange={setIndex}
		/>
	);
};

export default SearchResults;
