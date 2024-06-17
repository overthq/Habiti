import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Typography from './Typography';

// It is not lost on me that this is probably a bad name/idea for a component.
// TODO: Move this entire component to a "subtype" of `Button`

interface SmallButtonProps {
	text: string;
}

const SmallButton: React.FC<SmallButtonProps> = ({ text }) => {
	return (
		<Pressable style={styles.container}>
			<Typography>{text}</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {}
});

export default SmallButton;
