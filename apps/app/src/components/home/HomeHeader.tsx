import { Icon, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Animated, {
	FadeInDown,
	FadeInUp,
	FadeOutUp,
	LinearTransition
} from 'react-native-reanimated';

interface HomeHeaderProps {
	searchOpen: boolean;
	setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HomeHeader: React.FC<HomeHeaderProps> = ({
	searchOpen,
	setSearchOpen
}) => {
	const { theme } = useTheme();

	return (
		<Animated.View
			style={[
				styles.container,
				{ borderBottomWidth: 0.5, borderBottomColor: theme.border.color }
			]}
		>
			{!searchOpen && (
				<Animated.View entering={FadeInUp} exiting={FadeOutUp}>
					<Typography size='xxlarge' weight='bold'>
						Home
					</Typography>
				</Animated.View>
			)}
			<Animated.View
				layout={LinearTransition}
				style={{ flexDirection: 'row', gap: 12 }}
			>
				<AnimatedPressable
					style={[styles.search, { backgroundColor: theme.input.background }]}
					onPress={() => setSearchOpen(!searchOpen)}
				>
					<Icon name='search' size={20} color={theme.input.placeholder} />
					<Typography style={{ color: theme.input.placeholder }}>
						Search all stores and products
					</Typography>
				</AnimatedPressable>
				{searchOpen && (
					<Pressable
						style={[styles.search, { backgroundColor: theme.input.background }]}
						onPress={() => setSearchOpen(!searchOpen)}
					>
						<Icon name='x' size={20} color={theme.input.placeholder} />
						<Typography style={{ color: theme.input.placeholder }}>
							Close search
						</Typography>
					</Pressable>
				)}
			</Animated.View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 12
	},
	title: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	search: {
		marginTop: 12,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		gap: 8
	}
});

export default HomeHeader;
