import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';
import ManagePayouts from '../components/overview/ManagePayouts';
import LowStockProducts from '../components/overview/LowStockProducts';
import ScrollableScreen from '../components/global/ScrollableScreen';

// Overview
// - Available (unpaid) revenue
// - Keep stats on hold.
// - Information on next payout.

// General things to do
// - Add onboarding section to app.

// Probably add a greeting (to take space): "Good afternoon, {name}".

const Overview: React.FC = () => {
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					style={styles.settings}
					onPress={() => navigation.navigate('Settings')}
				>
					<Icon name='settings' />
				</TouchableOpacity>
			)
		});
	}, []);

	return (
		<ScrollableScreen style={styles.container}>
			<ManagePayouts />
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
	},
	stats: {
		paddingHorizontal: 16,
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});

export default Overview;
