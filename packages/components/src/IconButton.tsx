import React from 'react';
import { Pressable } from 'react-native';

import { Icon, IconProps } from './Icon';

interface IconButtonProps extends IconProps {
	children: React.ReactNode;
	onPress(): void;
	disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
	size,
	color,
	name,
	style,
	onPress,
	disabled
}) => {
	return (
		<Pressable onPress={onPress} disabled={disabled} style={style}>
			<Icon name={name} size={size} color={color} />
		</Pressable>
	);
};

export default IconButton;
