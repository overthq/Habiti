import React from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	ScrollView,
	Image,
	Text,
	TouchableOpacity,
	// Alert,
	LayoutAnimation
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// import { useStoresQuery, SearchQuery, SearchDocument } from '../types/api';
// import { useClient } from 'urql';
import { stores, items } from '../api';
import SearchBar from '../components/explore/SearchBar';
import ListEmpty from '../components/global/ListEmpty';

const Explore = () => {
	// const [searchData, setSearchData] = React.useState<SearchQuery | undefined>();
	const searchData = { stores, items };
	const [searchBarFocused, setSearchBarFocused] = React.useState(false);
	// const [{ data }] = useStoresQuery();
	const { navigate } = useNavigation();
	// const client = useClient();

	React.useEffect(() => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}, [searchBarFocused]);

	const handleSearch = async (searchTerm: string) => {
		console.log(searchTerm);
		// const { data, error } = await client
		// 	.query<SearchQuery>(SearchDocument, { searchTerm: `%${searchTerm}%` })
		// 	.toPromise();

		// setSearchData(data);

		// if (error) Alert.alert(error.message);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				style={{ backgroundColor: '#FFFFFF' }}
				showsVerticalScrollIndicator={false}
				bounces={false}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Explore</Text>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: 16
					}}
				>
					<SearchBar
						onSearchTermChange={handleSearch}
						onFocus={() => setSearchBarFocused(true)}
						onBlur={() => setSearchBarFocused(false)}
					/>
					{searchBarFocused && (
						<TouchableOpacity>
							<Text style={{ fontSize: 16, marginLeft: 8 }}>Cancel</Text>
						</TouchableOpacity>
					)}
				</View>
				{searchBarFocused ? (
					<View>
						<Text>{JSON.stringify(searchData)}</Text>
					</View>
				) : (
					<>
						<View style={{ marginTop: 8 }}>
							<Text style={styles.sectionHeader}>Trending Stores</Text>
							<FlatList
								horizontal
								data={stores}
								keyExtractor={({ id }) => id}
								contentContainerStyle={{ paddingLeft: 20, height: 95 }}
								renderItem={({ item }) => (
									<TouchableOpacity
										activeOpacity={0.8}
										style={{ justifyContent: 'center', height: '100%' }}
										onPress={() => navigate('Store', { storeId: item.id })}
									>
										<View key={item.id} style={styles.featuredStoreContainer}>
											<Image
												source={{ uri: item.avatarUrl }}
												style={{ height: 70, width: 70, borderRadius: 35 }}
											/>
										</View>
										<Text style={styles.storeName}>{item.name}</Text>
									</TouchableOpacity>
								)}
								ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
								ListEmptyComponent={
									<ListEmpty
										title='No trending stores'
										description='There are no stores trending currently.'
									/>
								}
							/>
						</View>
						<View style={{ marginTop: 16 }}>
							<Text style={styles.sectionHeader}>Featured Items</Text>
						</View>
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	header: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	},
	sectionHeader: {
		marginVertical: 5,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050',
		paddingLeft: 20
	},
	featuredStoreContainer: {
		backgroundColor: '#D3D3D3',
		width: 70,
		height: 70,
		borderRadius: 35,
		justifyContent: 'center',
		alignItems: 'center'
	},
	storeImageContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		marginLeft: 20
	},
	storeName: {
		fontWeight: '500',
		fontSize: 15,
		marginTop: 5,
		textAlign: 'center'
	}
});

export default Explore;
