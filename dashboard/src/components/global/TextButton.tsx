import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

interface TextButtonProps extends PressableProps {
	children: React.ReactNode;
	size?: number;
}

const TextButton: React.FC<TextButtonProps> = ({
	children,
	disabled,
	size,
	...props
}) => {
	return (
		<Pressable disabled={disabled} {...props}>
			<Text
				style={[
					{ color: disabled ? '#777777' : '#000000', fontSize: size ?? 17 }
				]}
			>
				{children}
			</Text>
		</Pressable>
	);
};

export default TextButton;
