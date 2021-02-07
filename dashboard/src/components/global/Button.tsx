import React from 'react';
import { Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';

// All components have to respond to global theme changes.
// and most have to be duplicated for use across the "app" and "dashboard" projects.

interface ButtonProps {
	onPress(): void;
	text: string;
	loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onPress, text, loading }) => (
	<Pressable style={styles.container} onPress={onPress}>
		{loading ? <ActivityIndicator /> : <Text style={styles.text}>{text}</Text>}
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000',
		height: 45,
		borderRadius: 4
	},
	text: {
		fontSize: 17,
		fontWeight: '500',
		color: '#FFFFFF'
	}
});

export default Button;
