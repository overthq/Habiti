import { Typography } from '@habiti/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface NumpadButtonProps {
	value: string;
	onPress(): void;
}

const NumpadButton: React.FC<NumpadButtonProps> = ({ value, onPress }) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<Typography size='xxxlarge' weight='medium' style={styles.text} number>
				{value}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 8,
		flexGrow: 1,
		justifyContent: 'center',
		alignContent: 'center'
	},
	text: {
		textAlign: 'center'
	}
});

export default NumpadButton;
