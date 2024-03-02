import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchBar from '../components/explore/SearchBar';
import SearchResults from '../components/explore/SearchResults';

const Search: React.FC = () => {
	const [searchData, setSearchData] = React.useState<{
		stores: any[];
		products: any[];
	}>({
		stores: [],
		products: []
	});
	const [searchBarFocused, setSearchBarFocused] = React.useState(false);

	const handleSearch = async (searchTerm: string) => {
		setSearchData({ stores: [], products: [] });
		console.log(searchTerm);
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
