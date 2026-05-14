import { ScrollableScreen, Spacer, useTheme } from '@habiti/components';
import { RefreshControl, View } from 'react-native';

import FollowedStores from './FollowedStores';
import RecentOrders from './RecentOrders';

import { useHomeQuery } from '../../data/queries';
import useRefresh from '../../hooks/useRefresh';
import HomeEmpty from './HomeEmpty';

interface HomeMainProps {
	searchOpen: boolean;
}

const HomeMain = ({ searchOpen }: HomeMainProps) => {
	const { data, isLoading, refetch } = useHomeQuery();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { theme } = useTheme();

	if (isLoading && !data) return <View />;

	if (!data || (data.orders.length === 0 && data.followed.length === 0)) {
		return <HomeEmpty />;
	}

	return (
		<ScrollableScreen
			style={{
				display: searchOpen ? 'none' : 'flex'
			}}
			contentContainerStyle={{
				flex: 1,
				padding: 0,
				backgroundColor: theme.screen.background
			}}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			<Spacer y={16} />
			<FollowedStores followed={data.followed} />
			<Spacer y={32} />
			<RecentOrders orders={data.orders} />
		</ScrollableScreen>
	);
};

export default HomeMain;
