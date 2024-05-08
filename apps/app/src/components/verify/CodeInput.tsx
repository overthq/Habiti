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
		backgroundColor: withTiming(theme.text[active ? 'primary' : 'tertiary'])
	}));

	return (
		<Pressable style={{ flex: 1 }}>
			<Animated.View style={[styles.container, style]}>
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
		backgroundColor: 'red',
		// flex: 1,
		flexGrow: 1,
		height: 56,
		// width: 48,
		borderRadius: 6,
		padding: 2
	},
	input: {
		flex: 1,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default CodeInput;
