import React from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Dimensions,
	Alert
} from 'react-native';
import { useClient } from 'urql';
import { Icon } from '../components/icons';
import { SearchDocument, SearchQuery } from '../types';

const { width } = Dimensions.get('window');

// Move this to screen with modal "preset" or use reanimated-bottom-sheet.
const Search = () => {
	const [data, setData] = React.useState<SearchQuery | undefined>();
	const client = useClient();

	const handleTextChange = async (searchTerm: string) => {
		const { data, error } = await client
			.query<SearchQuery>(SearchDocument, { searchTerm: `%${searchTerm}%` })
			.toPromise();

		setData(data);

		if (error) Alert.alert(error.message);
	};

	return (
		<View style={styles.container}>
			<View style={styles.handle} />
			<View style={styles.searchBar}>
				<Icon name='search' color='#505050' size={20} />
				<TextInput
					autoFocus
					placeholder='Search stores and items'
					onChangeText={handleTextChange}
					style={{ fontSize: 16, paddingLeft: 5 }}
					autoCorrect={false}
					autoCapitalize='none'
				/>
			</View>
			<Text>{JSON.stringify(data)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	handle: {
		width: 50,
		height: 5,
		borderRadius: 3.75,
		backgroundColor: '#D3D3D3',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: 10
	},
	searchBar: {
		alignSelf: 'center',
		borderRadius: 10,
		backgroundColor: '#D3D3D3',
		flexDirection: 'row',
		padding: 10,
		width: width - 40
	}
});

export default Search;
