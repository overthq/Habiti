import {
	Screen,
	ScreenHeader,
	ScrollableScreen,
	Spacer,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FollowedStores from '../components/home/FollowedStores';
import RecentOrders from '../components/home/RecentOrders';
import { useHomeQuery } from '../types/api';
import { HomeStackParamList } from '../types/navigation';

const Home: React.FC = () => {
	const [{ fetching, data }, refetch] = useHomeQuery();
	const { top } = useSafeAreaInsets();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
	const [refreshing, setRefreshing] = React.useState(false);
	const { theme } = useTheme();

	React.useEffect(() => {
		if (!fetching && refreshing) {
			setRefreshing(false);
		}
	}, [fetching, refreshing]);

	const handleRefresh = () => {
		setRefreshing(true);
		refetch();
	};

	if (fetching || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader
				title='Home'
				search={{
					placeholder: 'Search all stores and products',
					onPress: () => navigate('Home.Search')
				}}
			/>
			<ScrollableScreen
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor={theme.text.secondary}
					/>
				}
			>
				<Spacer y={16} />
				<FollowedStores followed={data.currentUser.followed} />
				<Spacer y={8} />
				<RecentOrders orders={data.currentUser.orders} />
			</ScrollableScreen>
		</Screen>
	);
};

export default Home;
