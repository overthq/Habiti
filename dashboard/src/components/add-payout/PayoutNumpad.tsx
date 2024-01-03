import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Button from '../global/Button';
import { Icon } from '../Icon';
import Typography from '../global/Typography';

interface PayoutNumpadProps {
	onUpdate(text: string): void;
	onDelete(): void;
	onClear(): void;
}

const PayoutNumpad: React.FC<PayoutNumpadProps> = ({ onDelete, onClear }) => {
	return (
		<View style={styles.container}>
			<View>
				<View style={styles.row}>
					<Pressable>
						<Typography>1</Typography>
					</Pressable>
					<Pressable>
						<Typography>2</Typography>
					</Pressable>
					<Pressable>
						<Typography>3</Typography>
					</Pressable>
				</View>
				<View style={styles.row}>
					<Pressable>
						<Typography>4</Typography>
					</Pressable>
					<Pressable>
						<Typography>5</Typography>
					</Pressable>
					<Pressable>
						<Typography>6</Typography>
					</Pressable>
				</View>
				<View style={styles.row}>
					<Pressable>
						<Typography>.</Typography>
					</Pressable>
					<Pressable>
						<Typography>0</Typography>
					</Pressable>
					<Pressable onPress={onDelete} onLongPress={onClear}>
						<Icon name='chevron-left' />
					</Pressable>
				</View>
			</View>
			<Button text='Payout' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16
	}
});

export default PayoutNumpad;
