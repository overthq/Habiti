import { Icon, Typography, useTheme } from '@habiti/components';
import { Pressable, StyleSheet, PressableProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FABProps extends PressableProps {
	text: string;
	safeAreaPadding?: boolean;
}

const FAB: React.FC<FABProps> = ({ text, safeAreaPadding, ...props }) => {
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	return (
		<Pressable
			style={[
				styles.container,
				{
					backgroundColor: theme.button.primary.background,
					bottom: safeAreaPadding ? bottom : 16
				}
			]}
			{...props}
		>
			<Icon name='plus' size={24} color={theme.button.primary.text} />
			<Typography
				weight='medium'
				size='large'
				style={{ color: theme.button.primary.text }}
			>
				{text}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
		justifyContent: 'space-between',
		alignSelf: 'center',
		borderRadius: 48,
		paddingVertical: 12,
		paddingLeft: 16,
		paddingRight: 20
	}
});

export default FAB;
