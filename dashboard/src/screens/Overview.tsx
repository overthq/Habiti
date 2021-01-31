import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// What should be on the Overview screen for stores?
// Charts (items sold per day for x past number of days etc).
// Quick numbers - Number of unfulfilled orders etc.
// "Show me the money" - Amount made today (also have chart for this - over time)

const Overview: React.FC = () => {
	return (
		<View style={styles.container}>
			<Text>Overview</Text>
			<Text>
				This screen will contain general information for store managers
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Overview;
