import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { Icon } from '../icons';

interface SearchBarProps {
	onSearchTermChange(term: string): void;
	isFocused: boolean;
	onFocus(): void;
	cancel(): void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	onSearchTermChange,
	isFocused,
	onFocus,
	cancel
}) => {
	const inputRef = React.useRef<TextInput>(null);

	return (
		<View style={styles.container}>
			<View style={styles.bar}>
				<Icon name='search' color='#505050' size={20} />
				<TextInput
					ref={inputRef}
					style={styles.input}
					placeholder='Search stores and items'
					onChangeText={onSearchTermChange}
					onFocus={onFocus}
					autoCorrect={false}
					autoCapitalize='none'
				/>
			</View>
			{isFocused && (
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={() => {
						cancel();
						inputRef.current?.blur();
					}}
				>
					<Text style={styles.cancelText}>Cancel</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16
	},
	bar: {
		borderRadius: 10,
		backgroundColor: 'rgb(229, 229, 234)',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		flexGrow: 1,
		height: 40
	},
	input: {
		fontSize: 16,
		paddingLeft: 8,
		height: '100%',
		flexGrow: 1
	},
	cancelButton: {
		marginLeft: 8
	},
	cancelText: {
		fontSize: 16
	}
});

export default SearchBar;
