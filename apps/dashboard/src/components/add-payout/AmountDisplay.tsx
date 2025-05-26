import { formatNaira } from '@habiti/common';
import { Typography } from '@habiti/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AmountDisplayProps {
	amount: string;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount }) => {
	const display = React.useMemo(() => {
		return formatNaira(Number(amount) * 100);
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
