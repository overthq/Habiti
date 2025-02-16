import { ScrollableScreen, Spacer, useTheme } from '@habiti/components';
import { RefreshControl } from 'react-native';

import FollowedStores from './FollowedStores';
import RecentOrders from './RecentOrders';

import { useHomeQuery } from '../../types/api';
import useRefresh from '../../hooks/useRefresh';

const HomeMain = () => {
	const [{ fetching, data }, refetch] = useHomeQuery();
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { theme } = useTheme();

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			<Spacer y={16} />
			<FollowedStores followed={data.currentUser.followed} />
			<Spacer y={8} />
			<RecentOrders orders={data.currentUser.orders} />
		</ScrollableScreen>
	);
};

export default HomeMain;
