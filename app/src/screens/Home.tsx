import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import RecentOrders from '../components/home/RecentOrders';
import Watchlist from '../components/home/Watchlist';
import FollowedStores from '../components/home/FollowedStores';
import { useHomeQuery } from '../types/api';

// TODO: To encourage purchases, whe should probably list the sections in this order:
// - "items you will love"
// - "watchlist/wishlist"
// - "discounts for you"
// - "followed stores"
// - "recent orders" (we might have an option to make this the most prominent, since
//   a number of users will want to look at their pending deliveries first).

// The idea with this is, we want going to the explore page to be the last resort.
// You should be able to get started buying things from the home page.

const Home: React.FC = () => {
	const [{ fetching, data }] = useHomeQuery();

	if (fetching || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<RecentOrders orders={data?.currentUser.orders} />
			<FollowedStores followed={data?.currentUser.followed} />
			<Watchlist watchlist={data?.currentUser.watchlist} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	}
});

export default Home;
