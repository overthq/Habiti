import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming
} from 'react-native-reanimated';

interface RadioProps {
	active: boolean;
}

const Radio: React.FC<RadioProps> = ({ active }) => {
	const style = useAnimatedStyle(() => {
		return { opacity: withTiming(active ? 1 : 0.5) };
	});

	return (
		<Animated.View style={[styles.circle, style]}>
			<View style={styles.border}>
				{active && <Animated.View style={[styles.dot, style]} />}
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	circle: {
		width: 20,
		height: 20,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF'
	},
	border: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000',
		width: 16,
		height: 16,
		borderRadius: 8
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#FFFFFF'
	}
});

export default Radio;
