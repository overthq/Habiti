import React from 'react';
import { View, RefreshControl } from 'react-native';
import {
	Screen,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';

import HomeHeader from '../components/home/HomeHeader';
import FollowedStores from '../components/home/FollowedStores';
import RecentOrders from '../components/home/RecentOrders';
import RecentlyViewed from '../components/home/RecentlyViewed';

import { useHomeQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';
import SearchResults from '../components/home/SearchResults';
import { useRecentlyViewedStore } from '../state/recentlyViewed';

const Home = () => {
	const [searchOpen, setSearchOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState('');
	const { top } = useSafeAreaInsets();

	return (
		<Screen style={{ paddingTop: top, marginHorizontal: -16 }}>
			<HomeHeader
				searchOpen={searchOpen}
				setSearchOpen={setSearchOpen}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>

			<Animated.View style={{ flex: 1 }} layout={LinearTransition}>
				<HomeMain searchOpen={searchOpen} />
				<HomeSearch searchTerm={searchTerm} searchOpen={searchOpen} />
			</Animated.View>
		</Screen>
	);
};

const HomeEmpty = () => {
	const { theme } = useTheme();

	return (
		<View style={{ flex: 1, padding: 16, alignItems: 'center' }}>
			<View
				style={{
					borderRadius: 8,
					backgroundColor: theme.modal.background,
					padding: 16
				}}
			>
				<Typography weight='medium' size='xlarge'>
					Welcome to Habiti
				</Typography>
				<Spacer y={4} />
				<Typography variant='secondary'>
					You can get started by searching for stores or products above.
				</Typography>
			</View>
		</View>
	);
};

interface HomeMainProps {
	searchOpen: boolean;
}

const HomeMain = ({ searchOpen }: HomeMainProps) => {
	const { data, isLoading, refetch } = useHomeQuery();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { theme } = useTheme();
	const recentlyViewedCount = useRecentlyViewedStore(
		state => state.products.length
	);

	if (isLoading && !data) return <View />;

	if (
		!data ||
		(data.orders.length === 0 &&
			data.followed.length === 0 &&
			recentlyViewedCount === 0)
	) {
		return <HomeEmpty />;
	}

	return (
		<ScrollableScreen
			style={{ display: searchOpen ? 'none' : 'flex' }}
			contentContainerStyle={{
				flex: 1,
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
			<RecentlyViewed />
			<Spacer y={32} />
			<RecentOrders orders={data.orders} />
		</ScrollableScreen>
	);
};

interface HomeSearchProps {
	searchTerm: string;
	searchOpen: boolean;
}

const HomeSearch = ({ searchTerm, searchOpen }: HomeSearchProps) => {
	const { theme } = useTheme();
	return (
		<Animated.View
			style={{
				flex: 1,
				backgroundColor: theme.screen.background,
				display: searchOpen ? 'flex' : 'none'
			}}
			layout={LinearTransition}
		>
			<SearchResults searchTerm={searchTerm} />
		</Animated.View>
	);
};

export default Home;
