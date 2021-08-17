import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrendingStores from '../components/explore/TrendingStores';

const Explore: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				style={{ backgroundColor: '#FFFFFF' }}
				showsVerticalScrollIndicator={false}
				bounces={false}
				keyboardShouldPersistTaps='handled'
			>
				{/* <View style={styles.header}>
					<Text style={styles.title}>Explore</Text>
				</View> */}
				<TrendingStores />
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
	},
	sectionHeader: {
		marginVertical: 5,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050',
		paddingLeft: 20
	}
});

export default Explore;
