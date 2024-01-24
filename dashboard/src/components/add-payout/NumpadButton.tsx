import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Typography from '../global/Typography';

interface NumpadButtonProps {
	value: string;
}

const NumpadButton: React.FC<NumpadButtonProps> = ({ value }) => {
	return (
		<Pressable style={styles.debug}>
			<Typography size='xxlarge' weight='medium' style={styles.text}>
				{value}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	debug: {
		padding: 8,
		// borderWidth: 1,
		// borderColor: 'red',
		flexGrow: 1
	},
	text: {
		textAlign: 'center',
		fontVariant: ['tabular-nums']
	}
});

export default NumpadButton;
