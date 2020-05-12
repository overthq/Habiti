import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/icons';

const { width } = Dimensions.get('window');

const Search = () => {
	const [searchTerm, setSearchTerm] = React.useState('');

	React.useEffect(() => {
		// Do we need to debounce this?
		console.log(searchTerm);
	}, [searchTerm]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.searchBar}>
				<Icon name='search' color='#505050' size={20} />
				<TextInput
					autoFocus
					placeholder='Search stores and items'
					onChangeText={setSearchTerm}
					style={{ fontSize: 16, paddingLeft: 5 }}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
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
