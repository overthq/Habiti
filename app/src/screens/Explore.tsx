import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Text,
	LayoutAnimation,
	Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchQuery, SearchDocument } from '../types/api';
import { useClient } from 'urql';
import SearchBar from '../components/explore/SearchBar';
import SearchResults from '../components/explore/SearchResults';
import TrendingStores from '../components/explore/TrendingStores';

const Explore: React.FC = () => {
	const [searchData, setSearchData] = React.useState<SearchQuery | undefined>();
	const [searchBarFocused, setSearchBarFocused] = React.useState(false);
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
		<SafeAreaView style={styles.container}>
			<ScrollView
				style={{ backgroundColor: '#FFFFFF' }}
				showsVerticalScrollIndicator={false}
				bounces={false}
				keyboardShouldPersistTaps='handled'
			>
				<View style={styles.header}>
					<Text style={styles.title}>Explore</Text>
				</View>
				<SearchBar
					onSearchTermChange={handleSearch}
					isFocused={searchBarFocused}
					onFocus={() => setSearchBarFocused(true)}
					cancel={() => setSearchBarFocused(false)}
				/>
				{searchBarFocused ? (
					<SearchResults searchData={searchData} />
				) : (
					<>
						<TrendingStores />
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
	storeImageContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		marginLeft: 20
	}
});

export default Explore;
