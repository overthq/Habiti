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
import ManagePayouts from '../components/overview/ManagePayouts';
import PendingOrders from '../components/overview/PendingOrders';
import LowStockProducts from '../components/overview/LowStockProducts';

const Overview: React.FC = () => {
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();
	const [period, setPeriod] = React.useState(StatPeriod.Week);
	const [{ fetching, data }] = useStatsQuery({ variables: { period } });

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
			<PeriodSelector selectedPeriod={period} setSelectedPeriod={setPeriod} />
			{fetching ? (
				<ActivityIndicator />
			) : (
				<View style={styles.stats}>
					<NumberStat title='Orders' value={data?.stats.orders.length ?? 0} />
					<NumberStat
						title='Revenue'
						value={data?.stats.revenue ?? 0}
						currency
					/>
				</View>
			)}
			<ManagePayouts />
			<PendingOrders />
			<LowStockProducts />
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
	},
	stats: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});

export default Overview;
