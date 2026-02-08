import React from 'react';
import { RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ScreenHeader, ScrollableScreen } from '@habiti/components';

import LowStockProducts from '../components/overview/LowStockProducts';
import ManagePayouts from '../components/overview/ManagePayouts';
import { useOverviewQuery, useCurrentStoreQuery } from '../data/queries';

const OverviewMain = () => {
	const { data, isLoading, refetch, isRefetching } = useOverviewQuery();
	const { data: storeData } = useCurrentStoreQuery();

	if (isLoading && !data) return null;

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
			}
		>
			<ManagePayouts realizedRevenue={storeData?.store?.realizedRevenue ?? 0} />
			<LowStockProducts products={data?.lowStockProducts ?? []} />
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
