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
import LowStockProducts from '../components/overview/LowStockProducts';
import OverviewActions from '../components/overview/OverviewActions';

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
			<OverviewActions
				lowStockCount={0}
				pendingOrderCount={data?.stats?.pendingOrderCount ?? 0}
			/>
			<LowStockProducts />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	settings: {
		marginRight: 16
	},
	stats: {
		paddingHorizontal: 16,
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});

export default Overview;
