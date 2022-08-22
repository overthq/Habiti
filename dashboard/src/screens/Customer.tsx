import React from 'react';
import { View, StyleSheet } from 'react-native';

// TODO: This screen should display important info and stats about a customer.
// For starters, it should show:
// - Name
// - All-time stats (items bought, amount spent, number of orders).
// - List of items ordered.
// It should also be a iOS 13-style modal.

const Customer: React.FC = () => {
	// const { userId } = useRoute<RouteProp<AppStackParamList, 'Customer'>>();
	// const [{ data, fetching }] = useCustomerDetails({ variables: { userId }});

	// if (fetching) {
	// 	return (
	// 		<View>
	// 			<ActivityIndicator />
	// 		</View>
	// 	);
	// }

	return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Customer;
