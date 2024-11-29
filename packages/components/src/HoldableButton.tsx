import React from 'react';
import {
	Pressable,
	StyleSheet,
	ViewStyle,
	ActivityIndicator,
	PressableProps
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming,
	useSharedValue,
	runOnJS,
	withSequence
} from 'react-native-reanimated';

import { useTheme } from './Theme';
import Typography from './Typography';
import { ThemeObject } from './styles/theme';

interface HoldableButtonProps extends PressableProps {
	onComplete: () => void;
	duration?: number;
	style?: ViewStyle;
	variant?: keyof ThemeObject['button'];
	text?: string;
	loading?: boolean;
	children?: React.ReactNode;
	disabled?: boolean;
}

const HoldableButton: React.FC<HoldableButtonProps> = ({
	onComplete,
	duration = 2000,
	style,
	variant = 'primary',
	text,
	loading,
	children,
	disabled = false,
	...props
}) => {
	const progress = useSharedValue(0);
	const { theme } = useTheme();
	const colors = theme.button[disabled ? 'disabled' : variant];

	const handlePressIn = () => {
		if (!disabled && !loading) {
			progress.value = withTiming(1, { duration }, finished => {
				if (finished) {
					runOnJS(onComplete)();
				}
			});
		}
	};

	const handlePressOut = () => {
		progress.value = withSequence(
			withTiming(progress.value, { duration: 0 }), // Freeze at current value
			withTiming(0, { duration: 100 }) // Animate back to 0
		);
	};

	const animatedStyle = useAnimatedStyle(() => ({
		width: `${progress.value * 100}%`
	}));

	return (
		<Pressable
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={[styles.container, { backgroundColor: colors.background }, style]}
			disabled={disabled || loading}
			{...props}
		>
			<Animated.View
				style={[
					styles.progressBar,
					{ backgroundColor: colors.text },
					animatedStyle
				]}
			/>
			{loading ? (
				<ActivityIndicator color={colors.text} />
			) : text ? (
				<Typography
					weight='medium'
					style={[styles.text, { color: colors.text }]}
				>
					{text}
				</Typography>
			) : (
				children
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		height: 44,
		borderRadius: 6,
		overflow: 'hidden'
	},
	text: {
		fontSize: 17,
		zIndex: 1
	},
	progressBar: {
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		opacity: 0.15,
		zIndex: 0
	}
});

export default HoldableButton;
