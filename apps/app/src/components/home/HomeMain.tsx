import { ScrollableScreen, Spacer, useTheme } from '@habiti/components';
import { ActivityIndicator, RefreshControl, View } from 'react-native';

import FollowedStores from './FollowedStores';
import RecentOrders from './RecentOrders';

import { useHomeQuery } from '../../types/api';
import useRefresh from '../../hooks/useRefresh';
import HomeEmpty from './HomeEmpty';

interface HomeMainProps {
	searchOpen: boolean;
	setSearchOpen: (value: boolean) => void;
}

const HomeMain: React.FC<HomeMainProps> = () => {
	const [{ fetching, data }, refetch] = useHomeQuery();
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { theme } = useTheme();

	if (fetching) {
		return (
			<View>
				<ActivityIndicator color={theme.text.primary} />
			</View>
		);
	}

	if (
		!data ||
		(data.currentUser.orders.length === 0 &&
			data.currentUser.followed.length === 0)
	) {
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
			<FollowedStores followed={data.currentUser.followed} />
			<Spacer y={8} />
			<RecentOrders orders={data.currentUser.orders} />
		</ScrollableScreen>
	);
};

export default HomeMain;
