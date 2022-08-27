import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { OrderQuery } from '../../types/api';

// Just a simple button that navigates to the CustomerInfo screen

interface CustomerDetailProps {
	user: OrderQuery['order']['user'];
}

const CustomerDetails: React.FC<CustomerDetailProps> = ({ user }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handlePress = React.useCallback(() => {
		navigate('CustomerInfo', { userId: user.id });
	}, []);

	return (
		<View>
			<Text>Customer</Text>
			<Pressable onPress={handlePress}>
				<Text>{user.name}</Text>
			</Pressable>
		</View>
	);
};

export default CustomerDetails;
