import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../Icon';
import { StackNavigationProp } from '@react-navigation/stack';

interface SettingRowProps {
	name: string;
	screen: any;
	displayValue?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
	name,
	screen,
	displayValue
}) => {
	const { navigate } = useNavigation<StackNavigationProp<any>>();

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.container}
			onPress={() => navigate(screen)}
		>
			<Text style={styles.settingName}>{name}</Text>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View>
					{displayValue && (
						<Text style={styles.settingDisplay}>{displayValue}</Text>
					)}
				</View>
				<Icon
					name='chevron-right'
					color='#505050'
					size={24}
					style={{ marginLeft: 8 }}
				/>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 45,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#EDEDED',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	settingName: {
		fontSize: 16
	},
	settingDisplay: {
		fontSize: 16,
		color: '#505050'
	}
});

export default SettingRow;
