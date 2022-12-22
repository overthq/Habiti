import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

interface TextButtonProps extends PressableProps {
	children: React.ReactNode;
}

const TextButton: React.FC<TextButtonProps> = ({
	children,
	disabled,
	...props
}) => {
	return (
		<Pressable disabled={disabled} {...props}>
			<Text style={[styles.text, { color: disabled ? '#777777' : '#000000' }]}>
				{children}
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	text: {
		fontSize: 16
	}
});

export default TextButton;
