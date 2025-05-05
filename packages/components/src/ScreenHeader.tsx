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
	right?: React.ReactNode;
	goBack?: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
	title,
	hasBottomBorder = false,
	search,
	right,
	goBack
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
			<View style={styles.title}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					{goBack && (
						<Pressable onPress={goBack}>
							<Icon name='arrow-left' size={20} color={theme.text.primary} />
						</Pressable>
					)}
					<Typography size='xxlarge' weight='bold'>
						{title}
					</Typography>
				</View>
				{right}
			</View>
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

export default ScreenHeader;
