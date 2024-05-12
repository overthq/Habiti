import { Icon, Typography } from '@market/components';
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	interpolate,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';

// FIXME: Maybe there is a more ergonomic way to handle
// the fact that onPress in this case is always a toggle/expand action
// but it's not really that important for now.
// Also, figure out effective way of getting rid of effect here.

interface AccordionRowProps {
	title: string;
	children: React.ReactNode;
	open: boolean;
	display?: string;
	onPress(): void;
}

const AccordionRow: React.FC<AccordionRowProps> = ({
	title,
	children,
	open,
	display,
	onPress
}) => {
	const offset = useSharedValue(0);

	React.useEffect(() => {
		offset.value = withTiming(open ? 1 : 0);
	}, [open]);

	const rotate = useDerivedValue(() => {
		return `${interpolate(offset.value, [0, 1], [0, -180])}deg`;
	});

	const animatedStyle = useAnimatedStyle(() => {
		return { transform: [{ rotateZ: rotate.value }] };
	});

	return (
		<Animated.View layout={LinearTransition} style={styles.container}>
			<Pressable style={styles.row} onPress={onPress}>
				<Typography>{title}</Typography>
				<View style={styles.right}>
					<Typography variant='secondary'>{display}</Typography>
					<Animated.View style={animatedStyle}>
						<Icon name='chevron-down' />
					</Animated.View>
				</View>
			</Pressable>
			{open && (
				<Animated.View entering={FadeIn} exiting={FadeOut}>
					{children}
				</Animated.View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 8
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingRight: 8
	},
	right: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default AccordionRow;
