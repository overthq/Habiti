import { Icon, ScrollableScreen } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import LowStockProducts from '../components/overview/LowStockProducts';
import ManagePayouts from '../components/overview/ManagePayouts';
// import QuickActions from '../components/overview/QuickActions';
import { AppStackParamList } from '../types/navigation';

// Revenue and payout information (front and center)
// Quick actions (orders to process, low stock products)

const Overview: React.FC = () => {
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	const goToSettings = React.useCallback(() => {
		navigation.navigate('Settings');
	}, []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable onPress={goToSettings}>
					<Icon name='settings' />
				</Pressable>
			)
		});
	}, []);

	return (
		<ScrollableScreen style={styles.container}>
			<ManagePayouts />
			{/* <QuickActions /> */}
			<LowStockProducts />
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	}
});

export default Overview;
