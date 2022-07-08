import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import RecentOrders from '../components/home/RecentOrders';
import Watchlist from '../components/home/Watchlist';
import FollowedStores from '../components/home/FollowedStores';
import { useHomeQuery } from '../types/api';

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
