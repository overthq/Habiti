import React from 'react';
import { View } from 'react-native';
import { Button, Spacer, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { OrdersStackParamList } from '../../navigation/types';
import { User } from '../../data/types';

interface CustomerDetailProps {
	user: User;
}

const CustomerDetails: React.FC<CustomerDetailProps> = ({ user }) => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();

	const handlePress = React.useCallback(() => {
		navigate('CustomerInfo', { userId: user.id });
	}, [navigate, user.id]);

	return (
		<View>
			<Typography weight='medium'>Customer</Typography>
			<Spacer y={8} />
			<Typography>{user.name}</Typography>
			<Spacer y={12} />
			<Button text='View order history' onPress={handlePress} />
		</View>
	);
};

export default CustomerDetails;
