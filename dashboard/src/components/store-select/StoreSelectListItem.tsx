import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface StoresListItemProps {
	text: string;
	selected: boolean;
	onPress(): void;
}

const StoreSelectListItem: React.FC<StoresListItemProps> = ({
	selected,
	onPress,
	text
}) => (
	<Pressable
		onPress={onPress}
		style={[styles.container, selected ? styles.selected : undefined]}
	>
		<Text style={[styles.text, selected ? styles.selectedText : undefined]}>
			{text}
		</Text>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		borderWidth: 2,
		borderColor: '#D3D3D3',
		padding: 16,
		borderRadius: 4,
		marginBottom: 8
	},
	selected: {
		backgroundColor: '#D3D3D3'
	},
	text: {
		fontSize: 16
	},
	selectedText: {
		fontWeight: '500'
	}
});

export default StoreSelectListItem;
