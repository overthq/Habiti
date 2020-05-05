import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import RecentOrders from '../components/RecentOrders';

const Home = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Home</Text>
			</View>
			<RecentOrders />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		paddingVertical: 15,
		paddingHorizontal: 20
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	}
});

export default Home;
