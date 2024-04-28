import React from 'react';
import { Pressable, PressableProps } from 'react-native';

import { useTheme } from './Theme';
import Typography from './Typography';
import { typography } from './styles/typography';

interface TextButtonProps extends PressableProps {
	children: React.ReactNode;
	size?: number;
	weight?: keyof typeof typography.weight;
}

const TextButton: React.FC<TextButtonProps> = ({
	children,
	disabled,
	size,
	weight = 'regular',
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Pressable disabled={disabled} {...props}>
			<Typography
				weight={weight}
				style={[
					{
						color: theme.text[disabled ? 'disabled' : 'primary'],
						fontSize: size ?? 17
					}
				]}
			>
				{children}
			</Typography>
		</Pressable>
	);
};

export default TextButton;
