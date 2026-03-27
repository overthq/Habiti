import React from 'react';
import { RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ScreenHeader, ScrollableScreen } from '@habiti/components';

import AwaitingPickupOrders from '../components/overview/AwaitingPickupOrders';
import LowStockProducts from '../components/overview/LowStockProducts';
import ManagePayouts from '../components/overview/ManagePayouts';
import { useOverviewQuery, useCurrentStoreQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';

const OverviewMain = () => {
	const { data, isLoading, refetch } = useOverviewQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch });
	const { data: storeData } = useCurrentStoreQuery();

	if (isLoading && !data) return null;

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
			}
		>
			<ManagePayouts realizedRevenue={storeData?.store?.realizedRevenue ?? 0} />
			<AwaitingPickupOrders />
			<LowStockProducts products={data?.lowStockProducts ?? []} />
		</ScrollableScreen>
	);
};

const Overview = () => {
	const { top } = useSafeAreaInsets();

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Overview' hasBottomBorder />
			<OverviewMain />
		</Screen>
	);
};

export default Overview;
