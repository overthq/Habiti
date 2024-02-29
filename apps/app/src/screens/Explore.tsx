import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import TrendingStores from '../components/explore/TrendingStores';

const Explore: React.FC = () => {
	return (
		<ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
			<TrendingStores />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	}
});

export default Explore;
