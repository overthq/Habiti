import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Icon } from '../Icon';

interface SettingRowProps {
	name: string;
	onPress(): void;
	displayValue?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
	name,
	onPress,
	displayValue
}) => (
	<Pressable style={styles.container} onPress={onPress}>
		<Text style={styles.settingName}>{name}</Text>
		<View style={styles.right}>
			{displayValue ? (
				<Text style={styles.settingDisplay}>{displayValue}</Text>
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

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 45,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#EDEDED',
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
	settingDisplay: {
		fontSize: 16,
		color: '#505050'
	},
	icon: {
		marginLeft: 8
	}
});

export default SettingRow;
