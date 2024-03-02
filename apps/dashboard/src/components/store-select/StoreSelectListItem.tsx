import { Typography } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

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
		<Typography weight={selected ? 'medium' : undefined}>{text}</Typography>
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
	}
});

export default StoreSelectListItem;
