import { Typography } from '@market/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { formatNaira } from '../../utils/currency';

interface AmountDisplayProps {
	amount: string;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount }) => {
	const display = React.useMemo(() => {
		// TODO: Compute correct value from `amount`.
		// Also make sure to account for parsing edge cases before using Number()
		// (They may not exist actually, but just make sure.)
		const computed = Number(amount) * 100;
		return formatNaira(computed);
	}, [amount]);

	return (
		<View style={styles.container}>
			<Typography style={styles.amount} weight='bold' size='xxxlarge' number>
				{display}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingVertical: 56,
		justifyContent: 'center'
	},
	amount: {
		textAlign: 'center',
		fontSize: 52
	}
});

export default AmountDisplay;
