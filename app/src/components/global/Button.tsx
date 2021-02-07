import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { useAppSelector } from '../../redux/store';

// All components have to respond to global theme changes.

interface ButtonProps {
	onPress(): void;
	text: string;
	loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onPress, text }) => {
	const theme = useAppSelector(({ theme }) => theme);
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<Text style={styles.text}>{text}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4
	},
	text: {
		fontSize: 17,
		fontWeight: '500'
	}
});

export default Button;
