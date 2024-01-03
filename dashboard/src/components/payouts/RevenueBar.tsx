import React from 'react';
import { View, StyleSheet } from 'react-native';

// Displays a breakdown of unrealized and realized revenue, as well as total amount available for payout.
// Total revenue = unrealized + realized
// Payed out = % of realized that has been claimed
// Available = % of realized that has not been claimed
// Available is displayed with a green bar section, as well as boldly displayed on the top of the screen
// Make sure to gracefully handle "0" edge case.
// Will doing this with SVGs make it significantly easier to animate?

interface RevenueBarProps {
	realizedRevenue: number;
	unrealizedRevenue: number;
	payedOut: number;
}

const RevenueBar: React.FC<RevenueBarProps> = ({
	realizedRevenue,
	unrealizedRevenue,
	payedOut
}) => {
	const totalRevenue = React.useMemo(
		() => realizedRevenue + unrealizedRevenue,
		[realizedRevenue, unrealizedRevenue]
	);

	const available = React.useMemo(
		() => realizedRevenue - payedOut,
		[realizedRevenue, payedOut]
	);

	const realizedPercent = React.useMemo(() => {
		return `${Math.floor((realizedRevenue / totalRevenue) * 100)}%` as const;
	}, [realizedRevenue, totalRevenue]);

	const availablePercent = React.useMemo(() => {
		return `${Math.floor((available / realizedRevenue) * 100)}%` as const;
	}, [available, realizedRevenue]);

	React.useEffect(() => {
		console.log('realizedPercent: ', realizedPercent);
		console.log('availablePercent: ', availablePercent);
	}, [realizedPercent, availablePercent]);

	return (
		<View style={styles.bar}>
			<View style={[styles.realized, { width: realizedPercent }]}>
				<View style={[styles.available, { width: availablePercent }]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	bar: {
		width: '100%',
		height: 16,
		borderRadius: 8,
		flexDirection: 'row',
		overflow: 'hidden',
		backgroundColor: 'grey',
		marginBottom: 8
	},
	realized: {
		backgroundColor: 'yellow',
		flexDirection: 'row'
	},
	available: {
		backgroundColor: 'green',
		height: '100%'
	}
});

export default RevenueBar;
