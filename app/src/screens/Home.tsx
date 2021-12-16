import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RecentOrders from '../components/home/RecentOrders';
import Watchlist from '../components/home/Watchlist';
import FollowedStores from '../components/home/FollowedStores';

const Home: React.FC = () => (
	<ScrollView style={styles.container}>
		<RecentOrders />
		<FollowedStores />
		<Watchlist />
	</ScrollView>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	header: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	}
});

export default Home;
