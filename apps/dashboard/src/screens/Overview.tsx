import React from 'react';
import { RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ScreenHeader, ScrollableScreen } from '@habiti/components';

import LowStockProducts from '../components/overview/LowStockProducts';
import ManagePayouts from '../components/overview/ManagePayouts';
import useRefresh from '../hooks/useRefresh';
import { useOverviewQuery } from '../types/api';

const OverviewMain = () => {
	const [{ data, fetching }, refetch] = useOverviewQuery();
	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	if (fetching && !data) return null;

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={refresh} />
			}
		>
			<ManagePayouts
				realizedRevenue={data?.currentStore.realizedRevenue ?? 0}
			/>
			<LowStockProducts products={data?.currentStore.products.edges ?? []} />
		</ScrollableScreen>
	);
};

const Overview: React.FC = () => {
	const { top } = useSafeAreaInsets();

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Overview' hasBottomBorder />
			<OverviewMain />
		</Screen>
	);
};

export default Overview;
