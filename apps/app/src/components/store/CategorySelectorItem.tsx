import React from 'react';
import { Pressable, View } from 'react-native';
import { Spacer, Typography, useTheme } from '@habiti/components';
import Animated, {
	useAnimatedStyle,
	withSpring,
	useSharedValue
} from 'react-native-reanimated';

interface CategorySelectorItemProps {
	name: string;
	onPress(): void;
	active: boolean;
}

const CategorySelectorItem: React.FC<CategorySelectorItemProps> = ({
	name,
	onPress,
	active
}) => {
	const { theme } = useTheme();
	const scale = useSharedValue(active ? 1 : 0);

	React.useEffect(() => {
		scale.value = withSpring(active ? 1 : 0, {
			damping: 15,
			stiffness: 120
		});
	}, [active]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: scale.value }],
		height: 2,
		backgroundColor: active ? theme.text.primary : 'transparent',
		width: '100%'
	}));

	return (
		<Pressable onPress={onPress}>
			<View style={{ paddingHorizontal: 16 }}>
				<Typography weight='medium' variant={active ? 'primary' : 'secondary'}>
					{name}
				</Typography>
			</View>
			<Spacer y={8} />
			<View style={{ alignItems: 'center' }}>
				<Animated.View style={animatedStyle} />
			</View>
		</Pressable>
	);
};

export default CategorySelectorItem;
