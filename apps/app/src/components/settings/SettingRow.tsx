import { Icon } from '@market/components';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
	<TouchableOpacity
		activeOpacity={0.8}
		style={styles.container}
		onPress={onPress}
	>
		<Text style={styles.name}>{name}</Text>
		<View style={styles.right}>
			{displayValue && (
				<View>
					<Text style={styles.display}>{displayValue}</Text>
				</View>
			)}
			<Icon
				name='chevron-right'
				color='#505050'
				size={24}
				style={styles.icon}
			/>
		</View>
	</TouchableOpacity>
);

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
	name: {
		fontSize: 16
	},
	display: {
		fontSize: 16,
		color: '#505050'
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
