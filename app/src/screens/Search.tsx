import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useClient } from 'urql';
import { Icon } from '../components/icons';
import { SearchDocument } from '../types';

const { width } = Dimensions.get('window');

const Search = () => {
	const [searchTerm, setSearchTerm] = React.useState('');
	const [data, setData] = React.useState({});

	const client = useClient();

	React.useEffect(() => {
		(async () => {
			const { data } = await client
				.query(SearchDocument, { searchTerm: `%${searchTerm}%` })
				.toPromise();
			setData(data);
		})();
	}, [searchTerm]);

	return (
		<View style={styles.container}>
			<View style={styles.handle} />
			<View style={styles.searchBar}>
				<Icon name='search' color='#505050' size={20} />
				<TextInput
					autoFocus
					placeholder='Search stores and items'
					onChangeText={setSearchTerm}
					style={{ fontSize: 16, paddingLeft: 5 }}
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
		width: 80,
		height: 7.5,
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
