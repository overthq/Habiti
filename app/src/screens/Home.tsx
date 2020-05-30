import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecentOrders from '../components/RecentOrders';
import FollowedStores from '../components/FollowedStores';
import { ScrollView } from 'react-native-gesture-handler';

const Home = () => {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView bounces={false}>
				<View style={styles.header}>
					<Text style={styles.title}>For You</Text>
				</View>
				<RecentOrders />
				<FollowedStores />
			</ScrollView>
		</SafeAreaView>
	);
};

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
