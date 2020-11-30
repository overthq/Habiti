import React from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	ScrollView,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	Dimensions,
	Alert,
	LayoutAnimation
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useStoresQuery, SearchQuery, SearchDocument } from '../types/api';
import { Icon } from '../components/icons';
import { useClient } from 'urql';

const { width } = Dimensions.get('window');

const Explore = () => {
	const [searchData, setSearchData] = React.useState<SearchQuery | undefined>();
	const [searchBarFocused, setSearchBarFocused] = React.useState(false);
	const [{ data }] = useStoresQuery();
	const { navigate } = useNavigation();
	const client = useClient();

	React.useEffect(() => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}, [searchBarFocused]);

	const handleSearch = async (searchTerm: string) => {
		const { data, error } = await client
			.query<SearchQuery>(SearchDocument, { searchTerm: `%${searchTerm}%` })
			.toPromise();

		setSearchData(data);

		if (error) Alert.alert(error.message);
	};

	return (
		<ScrollView
			style={{ backgroundColor: '#FFFFFF' }}
			showsVerticalScrollIndicator={false}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Explore</Text>
				</View>
				<View style={styles.searchBar}>
					<Icon name='search' color='#505050' size={20} />
					<TextInput
						placeholder='Search stores and items'
						onChangeText={handleSearch}
						onFocus={() => setSearchBarFocused(true)}
						onBlur={() => setSearchBarFocused(false)}
						style={{ fontSize: 16, paddingLeft: 5 }}
						autoCorrect={false}
						autoCapitalize='none'
					/>
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
								data={data?.stores}
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
												source={{
													uri: `https://twitter.com/allbirds/profile_image?size=original`
												}}
												style={{ height: 70, width: 70, borderRadius: 35 }}
											/>
										</View>
										<Text style={styles.storeName}>{item.name}</Text>
									</TouchableOpacity>
								)}
								ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
								ListEmptyComponent={
									<View style={{ height: '100%', width: '100%' }}>
										<Text
											style={{
												alignSelf: 'center',
												marginHorizontal: 'auto',
												fontSize: 16
											}}
										>
											There are no stores trending currently.
										</Text>
									</View>
								}
							/>
						</View>
						<View style={{ marginTop: 16 }}>
							<Text style={styles.sectionHeader}>Featured Items</Text>
						</View>
					</>
				)}
			</SafeAreaView>
		</ScrollView>
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
	searchBar: {
		alignSelf: 'center',
		borderRadius: 10,
		backgroundColor: '#D3D3D3',
		flexDirection: 'row',
		padding: 10,
		width: width - 40,
		height: 40
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
