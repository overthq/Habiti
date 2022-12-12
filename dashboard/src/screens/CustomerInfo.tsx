import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import { AppStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';

const CustomerInfo: React.FC = () => {
	// const { params } = useRoute<RouteProp<AppStackParamList, 'CustomerInfo'>>();
	useGoBack('x');
	// console.log(params.userId);

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Customer Information</Text>
			<Text style={styles.name}></Text>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	header: {},
	name: {
		fontSize: 16
	}
});

export default CustomerInfo;
