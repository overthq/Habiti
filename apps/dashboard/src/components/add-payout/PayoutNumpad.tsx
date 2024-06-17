import { Icon } from '@habiti/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import NumpadButton from './NumpadButton';

interface PayoutNumpadProps {
	onUpdate(text: string): void;
	onDelete(): void;
	onClear(): void;
}

// FIXME: Some weird styling issues here still mean that
// the '0' button is slightly skewed to the left.
// (It's visible with a border around the numpad buttons).

const PayoutNumpad: React.FC<PayoutNumpadProps> = ({
	onUpdate,
	onDelete,
	onClear
}) => {
	return (
		<View>
			<View style={styles.row}>
				<NumpadButton value='1' onPress={() => onUpdate('1')} />
				<NumpadButton value='2' onPress={() => onUpdate('2')} />
				<NumpadButton value='3' onPress={() => onUpdate('3')} />
			</View>
			<View style={styles.row}>
				<NumpadButton value='4' onPress={() => onUpdate('4')} />
				<NumpadButton value='5' onPress={() => onUpdate('5')} />
				<NumpadButton value='6' onPress={() => onUpdate('6')} />
			</View>
			<View style={styles.row}>
				<NumpadButton value='.' onPress={() => onUpdate('.')} />
				<NumpadButton value='0' onPress={() => onUpdate('0')} />
				<Pressable style={styles.back} onPress={onDelete} onLongPress={onClear}>
					<Icon size={24} name='chevron-left' />
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	cell: {
		flexGrow: 1,
		padding: 8
	},
	back: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 56
	}
});

export default PayoutNumpad;
