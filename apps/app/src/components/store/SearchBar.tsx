import React from 'react';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
	value: string;
	onChangeText(value: string): void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
	return (
		<View>
			<TextInput value={value} onChangeText={onChangeText} />
		</View>
	);
};

export default SearchBar;
