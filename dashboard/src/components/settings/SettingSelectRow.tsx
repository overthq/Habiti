import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Icon } from '../Icon';

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
	return (
		<Pressable style={styles.row} onPress={onSelectRow}>
			<Text style={{ fontSize: 16 }}>{name}</Text>
			<View>{isSelected && <Icon name='check' size={24} />}</View>
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
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5'
	}
});

export default SettingSelectRow;
