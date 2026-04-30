import React from 'react';
import { Pressable, PressableProps } from 'react-native';

import { useTheme } from './Theme';
import Typography, { TypographyProps } from './Typography';

interface TextButtonProps extends PressableProps {
	children: React.ReactNode;
	size?: number;
	weight?: TypographyProps['weight'];
	variant?: 'primary' | 'secondary' | 'label';
	active?: boolean;
}

const TextButton: React.FC<TextButtonProps> = ({
	children,
	disabled,
	size,
	weight = 'regular',
	active = true,
	variant = 'primary',
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Pressable disabled={disabled} {...props}>
			<Typography
				variant={variant}
				weight={weight}
				style={[
					{
						color:
							theme.text[
								disabled ? 'disabled' : active ? 'primary' : 'inactive'
							],
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
