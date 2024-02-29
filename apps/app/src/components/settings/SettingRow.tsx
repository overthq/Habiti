import { Icon, Typography } from '@market/components';
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
}) => (
	<Pressable style={styles.container} onPress={onPress}>
		<Typography>{name}</Typography>
		<View style={styles.right}>
			{displayValue && (
				<View>
					<Typography variant='secondary'>{displayValue}</Typography>
				</View>
			)}
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
		borderTopWidth: 1,
		borderTopColor: '#EDEDED',
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
