import React from 'react';
import { StyleSheet, View } from 'react-native';
import { formatNaira } from '../../utils/currency';
import Typography from '../global/Typography';

interface AmountDisplayProps {
	amount: string;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount }) => {
	const display = React.useMemo(() => {
		// TODO: Compute correct value from `amount`.
		return formatNaira(0);
	}, [amount]);

	return (
		<View style={styles.container}>
			<Typography style={styles.amount} weight='bold' size='xxlarge'>
				{display}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 64
	},
	amount: {
		textAlign: 'center',
		fontVariant: ['tabular-nums']
	}
});

export default AmountDisplay;
