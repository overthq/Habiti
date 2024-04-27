import React from 'react';
import { Pressable, PressableProps } from 'react-native';

import { useTheme } from './Theme';
import Typography from './Typography';

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
			<Typography
				style={[
					{
						color: theme.text[disabled ? 'disabled' : 'primary'],
						fontSize: size ?? 16
					}
				]}
			>
				{children}
			</Typography>
		</Pressable>
	);
};

export default TextButton;
