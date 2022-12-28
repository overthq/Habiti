import React from 'react';
import {
	View,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';
import { StatPeriod, useStatsQuery } from '../types/api';
import PeriodSelector from '../components/overview/PeriodSelector';
import NumberStat from '../components/overview/NumberStat';

// TODO (lessons from Shopify):
// - Actionable sections, button that has number of unfulfilled orders,
//   and navigates to the "Unfulfilled" section of the orders screen.
//   In the future, a button that shows a list of fulfilled orders that have
//   not been batched for delivery (and an easy way to do so).
// - Metrics on new customers, how many

// - Revenue
// - Orders (Total)
// - New customers
// - Pending orders
// - Low inventory items
// - (Maybe) unique store visits.

// - Payouts-related section (current available amount to payout).

const Overview: React.FC = () => {
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();
	const [selectedPeriod, setSelectedPeriod] = React.useState(StatPeriod.Week);
	const [{ fetching, data }] = useStatsQuery({
		variables: { period: selectedPeriod }
	});

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					style={styles.settings}
					onPress={() => navigation.navigate('Settings')}
				>
					<Icon name='settings' />
				</TouchableOpacity>
			)
		});
	}, []);

	return (
		<ScrollView style={styles.container}>
			<PeriodSelector
				selectedPeriod={selectedPeriod}
				setSelectedPeriod={setSelectedPeriod}
			/>
			{fetching ? (
				<ActivityIndicator />
			) : (
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					<NumberStat title='Orders' value={data?.stats.orders.length ?? 0} />
					<NumberStat
						title='Revenue'
						value={data?.stats.revenue ?? 0}
						currency
					/>
				</View>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16
	},
	settings: {
		marginRight: 16
	}
});

export default Overview;
