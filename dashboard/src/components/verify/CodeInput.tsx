import React from 'react';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';
import Typography from '../global/Typography';

interface CodeInputProps {
	active: boolean;
	value: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ active, value }) => {
	const { theme } = useTheme();

	const opacity = useSharedValue(0.5);

	React.useEffect(() => {
		opacity.value = withTiming(active ? 1 : 0.5);
	}, [active]);

	const style = useAnimatedStyle(() => {
		return { opacity: opacity.value };
	});

	return (
		<Animated.View
			style={[styles.container, { backgroundColor: theme.text.primary }, style]}
		>
			<View
				style={[styles.input, { backgroundColor: theme.screen.background }]}
			>
				<Typography weight='medium' size='xlarge'>
					{value}
				</Typography>
			</View>
		</Animated.View>
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
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default CodeInput;
