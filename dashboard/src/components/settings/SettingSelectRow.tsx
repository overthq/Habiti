import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import useTheme from '../../hooks/useTheme';
import Typography from '../global/Typography';

interface SettingSelectRowProps {
	name: string;
	isSelected: boolean;
	onSelectRow(): void;
}

const SettingSelectRow: React.FC<SettingSelectRowProps> = ({
	name,
	isSelected,
	onSelectRow
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[styles.row, { borderBottomColor: theme.border.color }]}
			onPress={onSelectRow}
		>
			<Typography style={{ fontSize: 16 }}>{name}</Typography>
			<View>{isSelected && <Icon name='check' size={22} />}</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: 'transparent',
		borderBottomWidth: 1,
		height: 44
	}
});

export default SettingSelectRow;
