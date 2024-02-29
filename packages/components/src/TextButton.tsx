import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

import { useTheme } from './Theme';

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
	const { theme } = useTheme();

	return (
		<Pressable disabled={disabled} {...props}>
			<Text
				style={[
					{
						color: disabled ? '#777777' : theme.text.primary,
						fontSize: size ?? 17
					}
				]}
			>
				{children}
			</Text>
		</Pressable>
	);
};

export default TextButton;
