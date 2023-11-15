import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import ScrollableScreen from '../components/global/ScrollableScreen';
import Typography from '../components/global/Typography';
import useGoBack from '../hooks/useGoBack';
import { useCustomerInfoQuery } from '../types/api';
import type { AppStackParamList } from '../types/navigation';
import { formatNaira } from '../utils/currency';

const CustomerInfo: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'CustomerInfo'>>();
	const [{ data, fetching }] = useCustomerInfoQuery({
		variables: { userId: params.userId }
	});

	useGoBack('x');

	if (fetching || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen style={styles.container}>
			<Typography style={styles.name}>{data.user.name}</Typography>
			<Typography>{data.user.phone}</Typography>
			<Typography>Previous Orders:</Typography>
			{data.user.orders.map(order => (
				<View key={order.id} style={styles.order}>
					<Typography>{formatNaira(order.total)}</Typography>
				</View>
			))}
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	name: {
		fontSize: 24,
		fontWeight: '500'
	},
	phone: {
		fontSize: 16
	},
	order: {
		padding: 16
	}
});

export default CustomerInfo;
