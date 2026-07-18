import React from 'react';
import { View, RefreshControl } from 'react-native';
import { Screen, ScrollableScreen, useTheme } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';

import HomeHeader from '../components/home/HomeHeader';
import FollowedStores from '../components/home/FollowedStores';
import RecentOrders from '../components/home/RecentOrders';
import RecentlyViewed from '../components/home/RecentlyViewed';
import TrendingStores from '../components/home/TrendingStores';
import FeaturedProducts from '../components/home/FeaturedProducts';

import { useHomeQuery, useLandingHighlightsQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';
import SearchResults from '../components/home/SearchResults';

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

interface HomeMainProps {
	searchOpen: boolean;
}

const HomeMain = ({ searchOpen }: HomeMainProps) => {
	const { data, isLoading, refetch } = useHomeQuery();
	const highlights = useLandingHighlightsQuery();
	const { theme } = useTheme();

	const refetchAll = React.useCallback(
		() => Promise.all([refetch(), highlights.refetch()]),
		[refetch, highlights.refetch]
	);

	const { refreshing, refresh } = useRefresh({ refetch: refetchAll });

	if (isLoading && highlights.isLoading && !data && !highlights.data) {
		return <View />;
	}

	return (
		<ScrollableScreen
			style={{ display: searchOpen ? 'none' : 'flex' }}
			contentContainerStyle={{
				flexGrow: 1,
				gap: 32,
				paddingTop: 16,
				paddingBottom: 32,
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
			{data ? <FollowedStores followed={data.followed} /> : null}

			<RecentlyViewed />

			{data ? <RecentOrders orders={data.orders} /> : null}

			{highlights.data ? (
				<TrendingStores stores={highlights.data.trendingStores} />
			) : null}

			{highlights.data ? (
				<FeaturedProducts products={highlights.data.featuredProducts} />
			) : null}
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
