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

	return (
		<View style={styles.bar}>
			<View />
			<View />
			<View />
		</View>
	);
};

const styles = StyleSheet.create({
	bar: {
		width: '100%',
		height: 16,
		borderRadius: 8,
		flexDirection: 'row',
		overflow: 'hidden'
	}
});

export default RevenueBar;
