import { useTheme, Typography } from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated';

interface CodeInputProps {
	value: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ value }) => {
	const { theme } = useTheme();
	const active = React.useMemo(() => !!value, [value]);

	const style = useAnimatedStyle(() => ({
		opacity: withTiming(active ? 1 : 0.5)
	}));

	return (
		<Pressable>
			<Animated.View
				style={[
					styles.container,
					{ backgroundColor: theme.text.primary },
					style
				]}
			>
				<View
					style={[styles.input, { backgroundColor: theme.screen.background }]}
				>
					<Typography weight='medium' size='xlarge'>
						{value}
					</Typography>
				</View>
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 48,
		width: 48,
		borderRadius: 4,
		padding: 2
	},
	input: {
		flex: 1,
		borderRadius: 2,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default CodeInput;
