import React from 'react';
import {
	Pressable,
	ActivityIndicator,
	StyleSheet,
	ViewStyle,
	PressableProps
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';

import { useTheme } from './Theme';
import { Icon, IconType } from './Icon';
import Typography, { TypographyProps } from './Typography';
import { palette } from './styles/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESS_TIMING = { duration: 120 };

const usePressAnimation = (disabled?: boolean | null) => {
	const pressed = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(
		() => ({
			opacity: disabled
				? 0.4
				: withTiming(pressed.value ? 0.85 : 1, PRESS_TIMING),
			transform: [{ scale: withTiming(pressed.value ? 0.97 : 1, PRESS_TIMING) }]
		}),
		[disabled]
	);

	const onPressIn = () => {
		pressed.value = 1;
	};

	const onPressOut = () => {
		pressed.value = 0;
	};

	return { animatedStyle, onPressIn, onPressOut };
};

type ButtonVariant = keyof (typeof colors)['light']['button'];

interface ButtonProps extends PressableProps {
	variant?: ButtonVariant;
	text: string;
	loading?: boolean;
	style?: ViewStyle;
	size?: 'small' | 'regular' | 'large';
}

const buttonSizeMap = {
	small: {
		height: 36,
		fontSize: 15
	},
	regular: {
		height: 44,
		fontSize: 17
	},
	large: {
		height: 48,
		fontSize: 17
	}
} as const;

const Button: React.FC<ButtonProps> = ({
	text,
	loading,
	style,
	variant = 'primary',
	size = 'regular',
	disabled,
	...props
}) => {
	const { name } = useTheme();
	const variantColors = colors[name].button[variant];
	const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(disabled);

	return (
		<AnimatedPressable
			style={[
				buttonStyles.container,
				{
					backgroundColor: variantColors.background,
					height: buttonSizeMap[size].height
				},
				animatedStyle,
				style
			]}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
			disabled={loading || disabled}
			{...props}
		>
			{loading ? (
				<ActivityIndicator />
			) : (
				<Typography
					weight='medium'
					style={[
						buttonStyles.text,
						{
							color: variantColors.text,
							fontSize: buttonSizeMap[size].fontSize
						}
					]}
				>
					{text}
				</Typography>
			)}
		</AnimatedPressable>
	);
};

const buttonStyles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 44,
		borderRadius: 8
	},
	text: {
		fontSize: 17
	}
});

interface PillButtonProps extends PressableProps {
	variant?: ButtonVariant;
	text: string;
	icon?: IconType;
	loading?: boolean;
	style?: ViewStyle;
	size?: 'small' | 'regular' | 'large';
}

const pillSizeMap = {
	small: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		fontSize: 13,
		iconSize: 16
	},
	regular: {
		paddingVertical: 9,
		paddingHorizontal: 18,
		fontSize: 15,
		iconSize: 18
	},
	large: {
		paddingVertical: 12,
		paddingHorizontal: 22,
		fontSize: 17,
		iconSize: 24
	}
} as const;

export const PillButton: React.FC<PillButtonProps> = ({
	text,
	icon,
	loading,
	style,
	variant = 'primary',
	size = 'regular',
	disabled,
	...props
}) => {
	const { name } = useTheme();
	const variantColors = colors[name].button[variant];
	const sizing = pillSizeMap[size];
	const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(disabled);

	return (
		<AnimatedPressable
			style={[
				pillStyles.container,
				{
					backgroundColor: variantColors.background,
					paddingVertical: sizing.paddingVertical,
					paddingHorizontal: sizing.paddingHorizontal
				},
				animatedStyle,
				style
			]}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
			disabled={loading || disabled}
			{...props}
		>
			{loading ? (
				<ActivityIndicator />
			) : (
				<>
					{icon && (
						<Icon
							name={icon}
							size={sizing.iconSize}
							color={variantColors.text}
						/>
					)}
					<Typography
						weight='medium'
						style={[
							pillStyles.text,
							{ color: variantColors.text, fontSize: sizing.fontSize }
						]}
					>
						{text}
					</Typography>
				</>
			)}
		</AnimatedPressable>
	);
};

const pillStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
		borderRadius: 999,
		alignSelf: 'flex-start'
	},
	text: {
		fontSize: 15
	}
});

interface TextButtonProps extends PressableProps {
	children: React.ReactNode;
	size?: number;
	weight?: TypographyProps['weight'];
	variant?: 'primary' | 'secondary' | 'label';
	active?: boolean;
}

export const TextButton: React.FC<TextButtonProps> = ({
	children,
	disabled,
	size,
	weight = 'regular',
	active = true,
	variant = 'primary',
	...props
}) => {
	const { name } = useTheme();
	const textColors = colors[name].text;

	return (
		<Pressable disabled={disabled} {...props}>
			<Typography
				variant={variant}
				weight={weight}
				style={[
					{
						color:
							textColors[
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

const MIN_TOUCH_TARGET = 44;

interface IconButtonProps extends Omit<PressableProps, 'children' | 'style'> {
	name: IconType;
	size?: number;
	color?: string;
	inset?: boolean;
	style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
	name,
	size = 24,
	color,
	disabled,
	inset = false,
	style,
	...props
}) => {
	return (
		<Pressable
			disabled={disabled}
			style={({ pressed }) => [
				iconButtonStyles.container,
				!inset && iconButtonStyles.standalone,
				{ opacity: disabled ? 0.4 : pressed ? 0.5 : 1 },
				style
			]}
			{...props}
		>
			<Icon name={name} size={size} color={color} />
		</Pressable>
	);
};

const iconButtonStyles = StyleSheet.create({
	container: {
		minHeight: MIN_TOUCH_TARGET,
		alignItems: 'center',
		justifyContent: 'center'
	},
	standalone: {
		minWidth: MIN_TOUCH_TARGET
	}
});

const colors = {
	dark: {
		button: {
			primary: {
				background: palette.neutral.n50,
				text: palette.neutral.n900
			},
			secondary: {
				background: palette.neutral.n800,
				text: palette.neutral.n200
			},
			tertiary: {
				background: '',
				text: ''
			},
			disabled: {
				background: palette.neutral.n700,
				text: palette.neutral.n200
			},
			destructive: {
				background: palette.red.r200,
				text: palette.red.r800
			}
		},
		text: {
			primary: palette.neutral.n50,
			disabled: palette.neutral.n500,
			inactive: palette.neutral.n600
		}
	},
	light: {
		button: {
			primary: {
				background: palette.neutral.n800,
				text: palette.neutral.n50
			},
			secondary: {
				background: palette.neutral.n200,
				text: palette.neutral.n700
			},
			tertiary: {
				background: '',
				text: ''
			},
			disabled: {
				background: palette.neutral.n200,
				text: palette.neutral.n700
			},
			destructive: {
				background: palette.red.r200,
				text: palette.red.r700
			}
		},
		text: {
			primary: palette.neutral.n800,
			disabled: palette.neutral.n400,
			inactive: palette.neutral.n500
		}
	}
} as const;

export default Button;
