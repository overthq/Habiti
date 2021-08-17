import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClient } from 'urql';
import SearchBar from '../components/explore/SearchBar';
import SearchResults from '../components/explore/SearchResults';
import { SearchQuery, SearchDocument } from '../types/api';

// Features:
// - Recent searches.
// - Tab-based results (items/stores).

const Search = () => {
	const client = useClient();
	const [searchData, setSearchData] = React.useState<SearchQuery>({
		stores: [],
		items: []
	});
	const [searchBarFocused, setSearchBarFocused] = React.useState(false);

	const handleSearch = async (searchTerm: string) => {
		const { data, error } = await client
			.query<SearchQuery>(SearchDocument, { searchTerm: `%${searchTerm}%` })
			.toPromise();

		if (data) setSearchData(data);

		if (error) Alert.alert(error.message);
	};

	return (
		<SafeAreaView style={styles.container}>
			<SearchBar
				onSearchTermChange={handleSearch}
				isFocused={searchBarFocused}
				onFocus={() => setSearchBarFocused(true)}
				cancel={() => setSearchBarFocused(false)}
			/>

			{searchBarFocused ? (
				<SearchResults searchData={searchData} />
			) : (
				// Recent searches
				<View />
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Search;
