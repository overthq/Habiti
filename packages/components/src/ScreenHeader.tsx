import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { Icon } from './Icon';
import { useTheme } from './Theme';
import Typography from './Typography';

interface ScreenHeaderProps {
	title: string;
	hasBottomBorder?: boolean;
	search?: {
		placeholder: string;
		onPress: () => void;
	};
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
	title,
	hasBottomBorder = false,
	search
}) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				hasBottomBorder
					? { borderBottomWidth: 0.5, borderBottomColor: theme.border.color }
					: {}
			]}
		>
			<Typography size='xxlarge' weight='bold'>
				{title}
			</Typography>
			{search && (
				<Pressable
					style={[styles.search, { backgroundColor: theme.input.background }]}
					onPress={search.onPress}
				>
					<Icon name='search' size={20} color={theme.input.placeholder} />
					<Typography style={{ color: theme.input.placeholder }}>
						{search.placeholder}
					</Typography>
				</Pressable>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 12
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

export default ScreenHeader;
