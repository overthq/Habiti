import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollableScreen, Spacer, Typography } from '@habiti/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';

import OrderDetail from '../components/customer-info/OrderDetail';
import useGoBack from '../hooks/useGoBack';
import { useCustomerInfoQuery } from '../types/api';
import type { AppStackParamList } from '../types/navigation';

const CustomerInfo: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'CustomerInfo'>>();
	const [{ data, fetching }] = useCustomerInfoQuery({
		variables: { userId: params.userId }
	});
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	useGoBack('x');

	const handleOrderPress = (id: string) => {
		navigate('Modal.Order', { orderId: id });
	};

	if (fetching || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen style={styles.container}>
			<Typography weight='medium' size='xlarge'>
				{data.user.name}
			</Typography>
			<Spacer y={2} />
			<Typography variant='secondary'>{data.user.email}</Typography>
			<Spacer y={12} />
			<Typography weight='medium'>Previous Orders</Typography>
			{data.user.orders.map(order => (
				<OrderDetail
					key={order.id}
					order={order}
					onPress={() => handleOrderPress(order.id)}
				/>
			))}
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default CustomerInfo;
