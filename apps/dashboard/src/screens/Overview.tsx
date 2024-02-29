import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';
import ManagePayouts from '../components/overview/ManagePayouts';
import ScrollableScreen from '../components/global/ScrollableScreen';
import QuickActions from '../components/overview/QuickActions';
import LowStockProducts from '../components/overview/LowStockProducts';

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
				<Pressable style={styles.settings} onPress={goToSettings}>
					<Icon name='settings' />
				</Pressable>
			)
		});
	}, []);

	return (
		<ScrollableScreen style={styles.container}>
			<ManagePayouts />
			<QuickActions />
			<LowStockProducts />
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	},
	settings: {
		marginRight: 16
	}
});

export default Overview;
