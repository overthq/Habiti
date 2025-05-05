import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';
import { AppStackParamList } from '../../types/navigation';
import { Icon, Typography, useTheme } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ViewCartProps {
	cartId?: string;
	count?: number;
}

const ViewCart = ({ cartId, count }: ViewCartProps) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	const handlePress = () => {
		navigate('Cart', { cartId });
	};

	if (!count || count === 0) return null;

	return (
		<Pressable
			style={[styles.button, { backgroundColor: theme.text.primary, bottom }]}
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
	);
};

const styles = StyleSheet.create({
	button: {
		position: 'absolute',
		borderRadius: 100,
		paddingHorizontal: 16,
		paddingVertical: 12,
		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	}
});

export default ViewCart;
