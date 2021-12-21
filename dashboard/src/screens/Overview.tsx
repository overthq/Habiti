import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/icons';
import { ModalStackParamList } from '../types/navigation';

// What should be on the Overview screen for stores?
// Charts (items sold per day for x past number of days etc).
// Quick numbers - Number of unfulfilled orders etc.
// "Show me the money" - Amount made today (also have chart for this - over time)
// Is it possible to query all of this data directly from GraphQL? (esp. over time data).
// It would mean querying aggregates, and then splitting them into time-separated batches.
// This is possible, but it's not scalable to run multiple queries (for each time interval) for a single chart.
// Which means it is imperative to create a complex query for these information blocks.
// In other words, TODO: charts.
// Focus on simple "in the past day" aggregates for now.

const Overview: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<ModalStackParamList>>();

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => navigate('SettingsStack')}>
				<Icon name='settings' />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Overview;
