import { Icon, Typography, useTheme } from '@habiti/components';
import { Pressable, StyleSheet, PressableProps } from 'react-native';

interface FABProps extends PressableProps {
	text: string;
}

const FAB: React.FC<FABProps> = ({ text, ...props }) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[
				styles.container,
				{ backgroundColor: theme.button.primary.background }
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
		bottom: 16,
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
