import { Screen, ScrollableScreen, Spacer, useTheme } from '@habiti/components';
import { RefreshControl, View } from 'react-native';

import FollowedStores from './FollowedStores';
import RecentOrders from './RecentOrders';

import { useHomeQuery } from '../../data/queries';
import useRefresh from '../../hooks/useRefresh';
import HomeEmpty from './HomeEmpty';

const HomeMain = () => {
	const { data, isLoading, refetch } = useHomeQuery();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { theme } = useTheme();

	if (isLoading && !data) return <View />;

	if (!data || (data.orders.length === 0 && data.followed.length === 0)) {
		return <HomeEmpty />;
	}

	return (
		<ScrollableScreen
			contentContainerStyle={{ backgroundColor: theme.screen.background }}
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

interface HomeMainWrapperProps {
	searchOpen: boolean;
}

const HomeMainWrapper: React.FC<HomeMainWrapperProps> = ({ searchOpen }) => {
	return (
		<Screen style={{ display: searchOpen ? 'none' : 'flex' }}>
			<HomeMain />
		</Screen>
	);
};

export default HomeMainWrapper;
