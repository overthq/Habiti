import { useTheme, Icon, Typography } from '@market/components';
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
			<Typography style={styles.settingName}>{name}</Typography>
			<View style={styles.right}>
				{displayValue ? (
					<Typography variant='label'>{displayValue}</Typography>
				) : null}
				<Icon
					name='chevron-right'
					color='#505050'
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
		backgroundColor: 'transparent',
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	settingName: {
		fontSize: 16
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
