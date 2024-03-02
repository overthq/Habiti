import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Typography from './Typography';

interface ListEmptyButtonProps {
	text: string;
	onPress(): void;
}

const ListEmptyButton: React.FC<ListEmptyButtonProps> = ({ text, onPress }) => (
	<Pressable style={styles.container} onPress={onPress}>
		<Typography weight='medium' style={styles.text}>
			{text}
		</Typography>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginVertical: 4,
		backgroundColor: '#D3D3D3',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		color: '#2B2B2B'
	}
});

export default ListEmptyButton;
