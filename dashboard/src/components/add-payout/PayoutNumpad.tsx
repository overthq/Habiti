import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Button from '../global/Button';
import { Icon } from '../Icon';
import Typography from '../global/Typography';
import NumpadButton from './NumpadButton';

interface PayoutNumpadProps {
	onUpdate(text: string): void;
	onDelete(): void;
	onClear(): void;
}

// FIXME: Some weird styling issues here still mean that
// the '0' button is slightly skewed to the left.
// (It's visible with a border around the numpad buttons).

const PayoutNumpad: React.FC<PayoutNumpadProps> = ({ onDelete, onClear }) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<NumpadButton value='1' />
				<NumpadButton value='2' />
				<NumpadButton value='3' />
			</View>
			<View style={styles.row}>
				<NumpadButton value='4' />
				<NumpadButton value='5' />
				<NumpadButton value='6' />
			</View>
			<View style={styles.row}>
				<Pressable style={styles.cell}>
					<Typography size='xlarge' style={styles.text}>
						.
					</Typography>
				</Pressable>
				<NumpadButton value='0' />
				<Pressable style={styles.back} onPress={onDelete} onLongPress={onClear}>
					<Icon size={24} name='chevron-left' />
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	cell: {
		flexGrow: 1,
		// borderColor: 'red',
		// borderWidth: 1,
		padding: 8
	},
	text: {
		textAlign: 'center',
		fontVariant: ['tabular-nums']
	},
	back: {
		flexGrow: 1,
		// borderColor: 'red',
		// borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16
	}
});

export default PayoutNumpad;
