import { useTheme, Typography } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated';

interface CodeInputProps {
	value: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ value }) => {
	const { theme } = useTheme();

	const style = useAnimatedStyle(() => ({
		borderColor: withTiming(theme.text[value ? 'primary' : 'tertiary'])
	}));

	return (
		<Pressable style={{ flex: 1 }}>
			<Animated.View style={[styles.container, style]}>
				<Typography weight='medium' size='xlarge'>
					{value}
				</Typography>
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		height: 48,
		borderRadius: 6,
		padding: 2,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1
	}
});

export default CodeInput;
