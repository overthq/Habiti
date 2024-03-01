import { Icon, Typography, useTheme } from '@market/components';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

interface SettingRowProps {
	name: string;
	onPress(): void;
	displayValue?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
	name,
	onPress,
	displayValue
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[styles.container, { borderBottomColor: theme.border.color }]}
			onPress={onPress}
		>
			<Typography>{name}</Typography>
			<View style={styles.right}>
				{displayValue ? (
					<Typography variant='secondary'>{displayValue}</Typography>
				) : null}
				<Icon
					name='chevron-right'
					color={theme.text.secondary}
					size={24}
					style={styles.icon}
				/>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 45,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	right: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	icon: {
		marginLeft: 8
	}
});

export default SettingRow;
