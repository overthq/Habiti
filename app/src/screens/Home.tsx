import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecentOrders from '../components/RecentOrders';
import { Icon } from '../components/icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Home = () => {
	const { navigate } = useNavigation();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Home</Text>
				<TouchableOpacity onPress={() => navigate('Carts')}>
					<Icon name='shoppingBag' />
				</TouchableOpacity>
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
