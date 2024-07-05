import React from 'react';
import { Pressable, PressableProps } from 'react-native';

import { useTheme } from './Theme';
import Typography from './Typography';
import { typography } from './styles/typography';

interface TextButtonProps extends PressableProps {
	children: React.ReactNode;
	size?: number;
	weight?: keyof typeof typography.weight;
	active?: boolean;
}

const TextButton: React.FC<TextButtonProps> = ({
	children,
	disabled,
	size,
	weight = 'regular',
	active = true,
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Pressable disabled={disabled} {...props}>
			<Typography
				weight={weight}
				style={[
					{
						color: theme.text[disabled || !active ? 'disabled' : 'primary'],
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
