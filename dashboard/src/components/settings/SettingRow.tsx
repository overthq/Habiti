import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../icons';

interface SettingRowProps {
	name: string;
	screenTo: string;
	displayValue?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
	name,
	screenTo,
	displayValue
}) => {
	const { navigate } = useNavigation();

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => navigate(screenTo)}
		>
			<Text>{name}</Text>
			<View>{displayValue && <Text>{displayValue}</Text>}</View>
			<Icon name='chevronRight' />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 40,
		paddingHorizontal: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default SettingRow;
