import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';
import { AppStackParamList } from '../../types/navigation';
import { Icon, Typography, useTheme } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';

interface ViewCartProps {
	cartId?: string;
	count?: number;
}

const ViewCart: React.FC<ViewCartProps> = ({ cartId, count }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	const handlePress = () => {
		navigate('Cart', { cartId });
	};

	if (!count || count === 0) return null;

	return (
		<Animated.View
			layout={LinearTransition}
			style={[styles.container, { bottom: bottom + 16 }]}
		>
			<Pressable
				style={[styles.button, { backgroundColor: theme.text.primary }]}
				onPress={handlePress}
			>
				<Icon name='shopping-basket' color={theme.text.invert} />
				<Typography
					weight='medium'
					size='large'
					style={{ color: theme.text.invert }}
				>
					View cart · {count}
				</Typography>
			</Pressable>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		alignSelf: 'center'
	},
	button: {
		borderRadius: 100,
		paddingHorizontal: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	}
});

export default ViewCart;
