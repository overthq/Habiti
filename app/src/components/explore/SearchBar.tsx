import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Icon } from '../icons';

const { width } = Dimensions.get('window');

interface SearchBarProps {
	onSearchTermChange(term: string): void;
	onFocus(): void;
	onBlur(): void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	onSearchTermChange,
	onFocus,
	onBlur
}) => (
	<View style={styles.container}>
		<Icon name='search' color='#505050' size={20} />
		<TextInput
			style={styles.input}
			placeholder='Search stores and items'
			onChangeText={onSearchTermChange}
			onFocus={onFocus}
			onBlur={onBlur}
			autoCorrect={false}
			autoCapitalize='none'
		/>
	</View>
);

const styles = StyleSheet.create({
	container: {
		// alignSelf: 'center',
		borderRadius: 10,
		backgroundColor: '#D3D3D3',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		// width: width - 40,
		flexGrow: 1,
		height: 40
	},
	input: {
		fontSize: 16,
		paddingLeft: 4,
		height: '100%',
		flexGrow: 1
	}
});

export default SearchBar;
